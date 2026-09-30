const sectors=[
{id:"communication",icon:"💬",name:"Comunicação",desc:"Entradas de site, redes sociais, mensageria, marketplaces e futuros canais."},
{id:"attendance",icon:"🤖",name:"Atendimento",desc:"Identifica cliente e intenção, responde e encaminha a operação."},
{id:"commerce",icon:"🛒",name:"Comércio",desc:"Produtos, carrinhos, sessões e pedidos."},
{id:"accounts",icon:"🧾",name:"Central de Contas",desc:"Operações de cobrança, recebimento, reembolso e conciliação."},
{id:"marketing",icon:"📣",name:"Marketing",desc:"Organiza necessidades de conteúdo e acompanha distribuição."},
{id:"suppliers",icon:"🏭",name:"Fornecedores",desc:"Pedidos de fornecimento e confirmação."},
{id:"logistics",icon:"🚚",name:"Logística",desc:"Envio, rastreio e exceções de entrega."},
{id:"after-sales",icon:"🔄",name:"Pós-venda",desc:"Rastreio, troca, reembolso, suporte e feedback."},
{id:"incidents",icon:"⚠️",name:"Ocorrências",desc:"Análise, resolução, cancelamento e reentrada de operações."},
{id:"library",icon:"📚",name:"Biblioteca",desc:"Registros, aprendizados e histórico durável da cidade."}
];
const details={
communication:["Canal é a porta. A operação continua sendo central.","SITE · SOCIAL · MESSAGING · MARKETPLACE · OTHER"],
attendance:["Fluxo: identificar cliente → intenção → catálogo → resposta → carrinho → pedido.","O atendimento pode encaminhar para humano sem perder a origem."],
commerce:["O pedido é a entidade central do ciclo comercial.","Fluxo: carrinho → pagamento → pedido → fornecedor → logística → pós-venda."],
accounts:["A Central de Contas concentra operações financeiras da cidade.","CHARGE · RECEIVE · REFUND · PAYOUT · RECONCILE"],
marketing:["Marketing recebe a necessidade comercial e organiza o trabalho de conteúdo.","MARKETING → DARK FACTORY → MARKETING → CHANNEL"],
suppliers:["A cidade solicita fornecimento sem ficar presa a um fornecedor específico.","Pedido ao fornecedor mantém estado e histórico."],
logistics:["A logística acompanha a entrega sem assumir a responsabilidade comercial do pedido.","PENDING → LABEL → IN TRANSIT → DELIVERY → EXCEPTION"],
"after-sales":["O pós-venda continua ligado ao pedido e ao cliente.","TRACKING · EXCHANGE · REFUND · SUPPORT · FEEDBACK"],
incidents:["Ocorrências preservam histórico e podem reencaminhar a operação.","OPEN → ANALYZING → RESOLVED / CANCELLED / REQUEUED"],
library:["A biblioteca guarda conhecimento operacional e aprendizados.","Nada precisa desaparecer para uma versão nova existir."]
};
const grid=document.querySelector("#sectorGrid"), home=document.querySelector("#home"), sector=document.querySelector("#sector");
sectors.forEach(s=>{const b=document.createElement("button");b.className="sector-btn";b.innerHTML=`<span class="sector-icon">${s.icon}</span><strong>${s.name}</strong><small>Entrar no setor →</small>`;b.onclick=()=>openSector(s);grid.appendChild(b)});
function openSector(s){document.querySelector("#sectorIcon").textContent=s.icon;document.querySelector("#sectorName").textContent=s.name;document.querySelector("#sectorDescription").textContent=s.desc;document.querySelector("#sectorBody").innerHTML=details[s.id].map((x,i)=>`<div class="info-card"><strong>${i?"Contrato":"Responsabilidade"}</strong><span>${x}</span></div>`).join("");home.classList.remove("active");sector.classList.add("active");history.replaceState(null,"","#"+s.id)}
document.querySelector("#backBtn").onclick=()=>{sector.classList.remove("active");home.classList.add("active");history.replaceState(null,"","#")};
document.querySelector("#themeToggle").onclick=()=>document.body.classList.toggle("light");
