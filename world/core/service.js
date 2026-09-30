/* WordDark Core — Service Registry / Execution Capability */
class WordDarkServiceRegistry {
 constructor(){this.services=new Map();}
 register(service){if(!service||!service.id||typeof service.executor!=="function")throw new Error("Serviço inválido.");if(this.services.has(service.id))throw new Error("Serviço já registrado.");this.services.set(service.id,service);return service;}
 get(id){return this.services.get(id)||null;}
 execute(id,operation){const s=this.get(id);if(!s)return {success:false,status:"FAILED",reason:"SERVICE_NOT_FOUND"};return s.executor(operation);}
 list(){return [...this.services.values()];}
}
if(typeof module!=="undefined")module.exports=WordDarkServiceRegistry;
if(typeof window!=="undefined")window.WordDarkServiceRegistry=WordDarkServiceRegistry;
