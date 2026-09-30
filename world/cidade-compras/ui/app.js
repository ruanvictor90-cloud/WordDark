const sectors=[
{id:"communication",icon:"💬",name:"Comunicação",desc:"Site, redes sociais, mensageria, marketplaces e futuros canais."},
{id:"attendance",icon:"🤖",name:"Atendimento",desc:"Identifica cliente e intenção, responde e encaminha a operação."},
{id:"commerce",icon:"🛒",name:"Comércio",desc:"Produtos, carrinhos, sessões e pedidos."},
{id:"accounts",icon:"🧾",name:"Central de Contas",desc:"Cobrança, recebimento, reembolso e conciliação."},
{id:"marketing",icon:"📣",name:"Marketing",desc:"Organiza necessidades de conteúdo e acompanha distribuição."},
{id:"suppliers",icon:"🏭",name:"Fornecedores",desc:"Pedidos de fornecimento e confirmação."},
{id:"logistics",icon:"🚚",name:"Logística",desc:"Envio, rastreio e exceções de entrega."},
{id:"after-sales",icon:"🔄",name:"Pós-venda",desc:"Rastreio, troca, reembolso, suporte e feedback."},
{id:"incidents",icon:"⚠️",name:"Ocorrências",desc:"Análise, resolução, cancelamento e reentrada."},
{id:"library",icon:"📚",name:"Biblioteca",desc:"Registros, aprendizados e histórico durável."}
];

const details={
communication:["Responsabilidade","Canal é a porta. A operação continua sendo central.","Canais","SITE · SOCIAL · MESSAGING · MARKETPLACE · OTHER"],
attendance:["Responsabilidade","Identificar cliente → intenção → catálogo → resposta → carrinho → pedido.","Regra","Pode encaminhar para humano sem perder a origem."],
commerce:["Responsabilidade","O pedido é a entidade central do ciclo comercial.","Fluxo","Carrinho → pagamento → pedido → fornecedor → logística → pós-venda."],
accounts:["Responsabilidade","A Central de Contas concentra operações financeiras da cidade.","Operações","CHARGE · RECEIVE · REFUND · PAYOUT · RECONCILE"],
marketing:["Responsabilidade","Recebe a necessidade comercial e organiza o trabalho de conteúdo.","Conexão","MARKETING → DARK FACTORY → MARKETING → CHANNEL"],
suppliers:["Responsabilidade","A cidade solicita fornecimento sem ficar presa a um fornecedor específico.","Regra","Pedido ao fornecedor mantém estado e histórico."],
logistics:["Responsabilidade","Acompanha a entrega sem assumir a responsabilidade comercial do pedido.","Estados","PENDING → LABEL → IN TRANSIT → DELIVERY → EXCEPTION"],
"after-sales":["Responsabilidade","Continua ligado ao pedido e ao cliente.","Tipos","TRACKING · EXCHANGE · REFUND · SUPPORT · FEEDBACK"],
incidents:["Responsabilidade","Preserva histórico e pode reencaminhar a operação.","Estados","OPEN → ANALYZING → RESOLVED / CANCELLED / REQUEUED"],
library:["Responsabilidade","Guarda conhecimento operacional e aprendizados.","Regra","Nada precisa desaparecer para uma versão nova existir."]
};

const state={orders:[],communications:[],incidents:[],services:[],events:[]};
const grid=document.querySelector("#sectorGrid"),home=document.querySelector("#home"),sector=document.querySelector("#sector");
const now=()=>new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const uid=(prefix)=>prefix+"-"+String(Date.now()).slice(-6);

function log(event,detail){state.events.unshift({event,detail,at:now()});renderSummary();}

function renderSummary(){
 document.querySelector("#pendingOrders").textContent=state.orders.filter(o=>!["DELIVERED","CANCELLED","REFUNDED"].includes(o.status)).length;
 document.querySelector("#pendingComms").textContent=state.communications.filter(c=>c.status==="OPEN").length;
 document.querySelector("#openIncidents").textContent=state.incidents.filter(i=>!["RESOLVED","CANCELLED"].includes(i.status)).length;
}

function createDemoOrder(){
 const order={id:uid("WD-ORD"),customer:"Cliente de teste",channel:"SOCIAL",total:129.90,status:"PAID",createdAt:now()};
 state.orders.unshift(order);
 log("ORDER_CREATED",order.id);
 openSector(sectors.find(s=>s.id==="commerce"),true);
}

function createDemoIncident(){
 const order=state.orders[0];
 const incident={id:uid("WD-ERR"),orderId:order?.id||"SEM-PEDIDO",type:"DELIVERY_EXCEPTION",status:"OPEN",description:"Ocorrência de teste da central."};
 state.incidents.unshift(incident);
 if(order) order.status="INCIDENT";
 log("INCIDENT_OPEN",incident.id);
 openSector(sectors.find(s=>s.id==="incidents"),true);
}

function requestMarketing(){
 const service={id:uid("WD-SVC"),service:"MARKETING",status:"REQUESTED",purpose:"Criar peça de conteúdo para canal comercial."};
 state.services.unshift(service);
 log("SERVICE_REQUESTED",service.id);
 openSector(sectors.find(s=>s.id==="marketing"),true);
}

function createSectorBody(id){
 const d=details[id];
 let html=`<div class="info-card"><strong>${d[0]}</strong><span>${d[1]}</span></div><div class="info-card"><strong>${d[2]}</strong><span>${d[3]}</span></div>`;
 if(id==="commerce") html+=`<div class="operation-card"><div><span class="eyebrow">OPERAÇÃO LOCAL</span><strong>Simulador de pedido</strong><small>Cria um registro de teste apenas nesta interface.</small></div><button class="primary" id="demoOrder">Criar pedido de teste</button></div><div id="orderList" class="operation-list">${renderOrders()}</div>`;
 if(id==="incidents") html+=`<div class="operation-card"><div><span class="eyebrow">RECUPERAÇÃO</span><strong>Central de ocorrências</strong><small>Abre uma ocorrência vinculada ao último pedido disponível.</small></div><button class="danger" id="demoIncident">Abrir ocorrência</button></div><div id="incidentList" class="operation-list">${renderIncidents()}</div>`;
 if(id==="marketing") html+=`<div class="operation-card"><div><span class="eyebrow">RODOVIA → CÉU</span><strong>Solicitar Marketing</strong><small>Representa uma solicitação que seguirá para o serviço externo.</small></div><button class="primary" id="demoMarketing">Solicitar serviço</button></div><div id="serviceList" class="operation-list">${renderServices()}</div>`;
 if(id==="library") html+=`<div class="operation-list">${state.events.length?state.events.slice(0,8).map(e=>`<div class="event"><span>${e.event}</span><small>${e.detail} · ${e.at}</small></div>`).join(""):"<div class='empty'>Nenhum evento registrado nesta sessão.</div>"}</div>`;
 return html;
}

function renderOrders(){return state.orders.length?state.orders.slice(0,5).map(o=>`<div class="event"><span>${o.id} · ${o.status}</span><small>${o.channel} · R$ ${o.total.toFixed(2).replace(".",",")}</small></div>`).join(""):"<div class='empty'>Nenhum pedido nesta sessão.</div>"}
function renderIncidents(){return state.incidents.length?state.incidents.slice(0,5).map(i=>`<div class="event"><span>${i.id} · ${i.status}</span><small>${i.type} · pedido ${i.orderId}</small></div>`).join(""):"<div class='empty'>Nenhuma ocorrência nesta sessão.</div>"}
function renderServices(){return state.services.length?state.services.slice(0,5).map(s=>`<div class="event"><span>${s.id} · ${s.status}</span><small>${s.service} · ${s.purpose}</small></div>`).join(""):"<div class='empty'>Nenhuma solicitação nesta sessão.</div>"}

function bindSectorActions(){
 const orderBtn=document.querySelector("#demoOrder"); if(orderBtn) orderBtn.onclick=createDemoOrder;
 const incidentBtn=document.querySelector("#demoIncident"); if(incidentBtn) incidentBtn.onclick=createDemoIncident;
 const marketingBtn=document.querySelector("#demoMarketing"); if(marketingBtn) marketingBtn.onclick=requestMarketing;
}

function openSector(s,refresh=false){
 document.querySelector("#sectorIcon").textContent=s.icon;
 document.querySelector("#sectorName").textContent=s.name;
 document.querySelector("#sectorDescription").textContent=s.desc;
 document.querySelector("#sectorBody").innerHTML=createSectorBody(s.id);
 home.classList.remove("active"); sector.classList.add("active");
 if(!refresh) history.replaceState(null,"","#"+s.id);
 bindSectorActions();
}

sectors.forEach(s=>{
 const b=document.createElement("button");
 b.className="sector-btn";
 b.innerHTML=`<span class="sector-icon">${s.icon}</span><strong>${s.name}</strong><small>Entrar no setor →</small>`;
 b.onclick=()=>openSector(s);
 grid.appendChild(b);
});

document.querySelector("#backBtn").onclick=()=>{
 sector.classList.remove("active");home.classList.add("active");history.replaceState(null,"","#");renderSummary();
};
document.querySelector("#themeToggle").onclick=()=>document.body.classList.toggle("light");
renderSummary();