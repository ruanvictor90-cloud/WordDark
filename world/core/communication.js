/* WordDark — Communication Bus
 * Transporte bidirecional de operações pela Rodovia Global.
 * Communication transporta; Security autoriza; Executor executa.
 */
class WordDarkCommunication {
  constructor({road=null, receiver=null, responseReceiver=null, registry=null}={}){
    this.road=road;
    this.receiver=receiver;
    this.responseReceiver=responseReceiver;
    this.registry=registry;
    this.messages=[];
    this.receipts=[];
  }
  generateId(prefix){return prefix+"-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();}
  sendOperation(operation){
    if(!this.road) return {success:false,reason:"Rodovia não configurada."};
    const request=new WordDarkRequest({
      requestId:"REQ-"+operation.operationId,
      operationId:operation.operationId,
      requesterId:operation.requesterId,
      originId:operation.originId,
      destinationId:operation.destinationId,
      service:operation.operationType,
      task:operation.payload && operation.payload.task || ("Executar operação "+operation.operationType),
      payload:operation.payload
    });
    const validation=request.validate();
    if(!validation.valid) return {success:false,reason:"Pedido inválido.",errors:validation.errors};
    const message=new WordDarkMessage({
      messageId:"MSG-"+operation.operationId,
      requestId:request.requestId,
      type:"OPERATION_REQUEST",
      origin:request.originId,
      destination:request.destinationId,
      service:request.service,
      payload:request.toJSON()
    });
    const delivery=this.road.send(message);
    if(!delivery.success) return delivery;
    this.messages.push(message.toJSON());
    const receipt=new WordDarkReceipt({
      receiptId:this.generateId("RCT"),
      messageId:message.messageId,
      requestId:request.requestId,
      operationId:operation.operationId,
      receiverId:request.destinationId,
      senderId:request.originId,
      routeId:delivery.routeId,
      status:"RECEIVED"
    });
    this.receipts.push(receipt.toJSON());
    if(this.registry && typeof this.registry.recordEvent==="function"){
      this.registry.recordEvent(operation,"MESSAGE_SENT",{message:message.toJSON(),delivery:delivery.delivery});
      this.registry.recordEvent(operation,"MESSAGE_RECEIVED",{receipt:receipt.toJSON()});
    }
    const inbound=this.receiver ? this.receiver(message,request,operation,receipt) : {success:true,result:{status:"RECEIVED"}};
    if(!inbound || inbound.success!==true) return {success:false,stage:"RECEIVER",reason:(inbound&&inbound.reason)||"Recebedor rejeitou o pedido.",request:request.toJSON(),receipt:receipt.toJSON()};
    const response=new WordDarkMessage({
      messageId:"RMSG-"+operation.operationId,
      requestId:request.requestId,
      type:"OPERATION_RESPONSE",
      origin:request.destinationId,
      destination:request.originId,
      service:request.service,
      responseTo:message.messageId,
      status:inbound.status || "PROCESSED",
      payload:inbound.result || inbound
    });
    const responseDelivery=this.road.send(response);
    if(!responseDelivery.success) return {success:false,stage:"RETURN_ROAD",reason:responseDelivery.reason,request:request.toJSON(),receipt:receipt.toJSON(),response:response.toJSON()};
    this.messages.push(response.toJSON());
    const responseReceipt=new WordDarkReceipt({
      receiptId:this.generateId("RCT"),
      messageId:response.messageId,
      requestId:request.requestId,
      operationId:operation.operationId,
      receiverId:request.originId,
      senderId:request.destinationId,
      routeId:responseDelivery.routeId,
      status:"RECEIVED",
      metadata:{responseTo:message.messageId}
    });
    this.receipts.push(responseReceipt.toJSON());
    if(this.registry && typeof this.registry.recordEvent==="function"){
      this.registry.recordEvent(operation,"RESPONSE_SENT",{message:response.toJSON(),delivery:responseDelivery.delivery});
      this.registry.recordEvent(operation,"RESPONSE_RECEIVED",{receipt:responseReceipt.toJSON()});
    }
    if(this.responseReceiver) this.responseReceiver(response,responseReceipt,operation);
    return {success:true,request:request.toJSON(),receipt:receipt.toJSON(),response:response.toJSON(),responseReceipt:responseReceipt.toJSON(),routeId:delivery.routeId,returnRouteId:responseDelivery.routeId,result:inbound.result||inbound};
  }
  getStatus(){return {messages:this.messages.length,receipts:this.receipts.length};}
}
if(typeof module!=="undefined") module.exports=WordDarkCommunication;
if(typeof window!=="undefined") window.WordDarkCommunication=WordDarkCommunication;
