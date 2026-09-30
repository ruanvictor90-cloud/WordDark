export function createCommerceCity({id,name="Cidade de Compras"}) {
  if (!id) throw new Error("INVALID_CITY");
  return {id,name,type:"COMMERCE_CITY",responsibility:"MULTICHANNEL_COMMERCE",entryGateId:null,sectors:[],channels:[],services:[],status:"DEVELOPMENT"};
}
