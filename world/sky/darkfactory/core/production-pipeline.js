/* WordDark — Dark Factory Production Pipeline · DF-0.7 */
class DarkFactoryProductionPipeline {
  constructor(options){options=options||{};this.registry=options.registry||null;this.validator=options.validator||null;}
  run(request){
    if(!request) return {success:false,status:"REJECTED",reason:"Requerimento ausente."};
    const type=request.taskType||(request.payload&&request.payload.taskType);
    const service=this.registry&&this.registry.resolve(type);
    if(!service) return {success:false,status:"REJECTED",reason:"Serviço não disponível.",type:type};
    const result=service.executor.execute(request);
    if(!result||result.success!==true) return result||{success:false,status:"FAILED",reason:"Executor sem resultado."};
    if(this.validator){const check=this.validator.validate(result,request);if(!check.valid)return {success:false,status:"REJECTED",reason:"Validação da produção falhou.",errors:check.errors||[]};}
    return {success:true,status:"COMPLETED",serviceId:service.serviceId,result:result};
  }
}
if(typeof module!=="undefined") module.exports=DarkFactoryProductionPipeline;
if(typeof window!=="undefined") window.DarkFactoryProductionPipeline=DarkFactoryProductionPipeline;
