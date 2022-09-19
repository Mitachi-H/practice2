let memberMap = new Map()
let eventMap = new Map()

const newMemberForm = document.querySelector("#newMember")
const allMember = document.querySelector("#allMember")
const allEvent = document.querySelector("#allEvent")
const calculator = document.querySelector("#calculator")
const lord = document.querySelector("#lord")

const newEvent = document.querySelector("#newEventTmpl").content.firstElementChild
const eventTmpl = document.querySelector("#eventTmpl").content.firstElementChild
const resultTmpl = document.querySelector("#resultTmpl").content.firstElementChild

newMemberForm.addEventListener("submit",event=>{
    event.preventDefault()
    addMember()
    newMemberForm.children[0].value=""
    setMember()
})
allMember.addEventListener("click",event=>{
    if(event.target.id=="deleteMember"){
        if(confirm("選択したメンバーを削除しますか？")){
            for(const v of allMember.children[2].querySelectorAll("input")){
                if(v.checked){
                    memberMap.delete(v.parentElement.textContent)
                    v.parentElement.remove()
                }
            }
        }
    }
    if(event.target.id=="showMember"){
        event.target.classList.toggle("active")
        showMember()
    }
    showDeleteButton()
})
allEvent.children[3].addEventListener("click",()=>{
    if(memberMap.size){
        createEvent()
    }
})
calculator.children[0].addEventListener("click",()=>{
    if(eventMap.size==0){
        alert("イベントが不十分です")
        throw new Error()
    }
    Caluculate()
    if(calculator.querySelector("#resultList").textContent==""){
        calculator.querySelector("#resultList").textContent="お金の受け渡しはありません"
    }
})
lord.addEventListener("click",()=>{
    lordData()
})

function addMember(){
    const member = newMemberForm.children[0].value
    if(member){
        if(memberMap.has(member)){
            alert("同じ名前のメンバーがすでにいます！")
        }else{
            memberMap.set(member,0)
            addJSON("member",memberMap)
        }
    }
}
function setMember(){
    allMember.children[2].textContent=""
    memberMap.forEach((value,name)=>{
        allMember.children[2].innerHTML+="<li class='hidden active'>"+name+"<input id='checkMember' type='checkbox'></li>"
    })
}
function showMember(){
    const memberList = allMember.children[4]
    for(const v of allMember.children[2].children){
        v.classList.toggle("active")
    }
}
function showDeleteButton(){
    allMember.children[3].classList.remove("active")
    if(allMember.children[2].firstElementChild.classList.contains("hidden")){
        for(const v of allMember.children[2].querySelectorAll("input")){
            if(v.checked){
                allMember.children[3].classList.add("active")
                break
            }
        }
    }
}
function createEvent(){
    const clone = newEvent.cloneNode(true)
    const payerList = clone.querySelector("#payerList")
    const recieverList = clone.querySelector("#receiverList")
    memberMap.forEach((value,name)=>{
        payerList.innerHTML+="<li>"+name+"<input type='checkbox'></li>"
        recieverList.innerHTML+="<li class='hidden'>"+name+"<input type='checkbox'></li>"
    })
    clone.addEventListener("click",newEventclick)
    allEvent.children[2].append(clone)
}
function newEventclick(event){
    if(event.target.classList[0]=="neweventbutton"){
        if(event.target.id=="addNewEvent"){
            addEvent(event.target.parentElement.children[1])
            setEvent()
        }
        event.currentTarget.remove()//登録されてるのがliだからそれが消える。
    }else if(event.target.id=="allCheck"){
        for(const v of event.target.parentElement.nextElementSibling.children){
            v.classList.toggle("active")
        }
    }
}
function addEvent(ul){
    let payerList = []
    let receiverList = []
    for(const li of ul.querySelector("#payerList").children){
        if(li.firstElementChild.checked){
            payerList.push(li.textContent)
        }
    }
    const allCheck = ul.querySelector("#allCheck").checked
    for(const li of ul.querySelector("#receiverList").children){
        if(allCheck){
            receiverList.push(li.textContent)
        }else if(li.firstElementChild.checked){
            receiverList.push(li.textContent)
        }
    }
    if(payerList.length==0||receiverList.length==0){
        alert("メンバーを選択してください")
        throw new Error()
    }
    if(/[0-9]+/.test(ul.querySelector("#newEventCost").value)){
        if(Number(ul.querySelector("#newEventCost").value)>0){
            let newEventName =ul.querySelector("#newEventName").value
            let maxValue=0
            eventMap.forEach((value,eventname)=>{
                if(newEventName==eventname){
                    alert("同じ名前のイベントが既に存在します！")
                    throw new Error()
                }
                if(!newEventName){
                    try{maxValue=Math.max(maxValue,Number(/^イベント+([0-9]*)$/.exec(eventname)[1]))}
                    catch{}
                }
            })
            if(!newEventName){
                newEventName="イベント"+Number(maxValue+1)
            }
            eventMap.set(newEventName,[payerList,receiverList,Number(ul.querySelector("#newEventCost").value)])
            addJSON("event",eventMap)
        }else{
            alert("支払い金額が0以下の数字です")
            throw new Error()  
        }
    }else{
        alert("支払い金額が正しくありません")
        throw new Error()
    }
}
function setEvent(){
    const ul = allEvent.querySelector("#eventList")
    ul.innerHTML=""
    eventMap.forEach((detail,eventname)=>{
        const clone = eventTmpl.cloneNode(true)
        clone.querySelector("#eventName").textContent=eventname
        clone.querySelector("#detail").textContent=detail[0].join(" , ")+" が "+detail[1].join(" , ")+" の分を支払い、"+detail[2]+"円かかった。"
        clone.addEventListener("click",eventClick)
        ul.append(clone)
    })
}
function eventClick(event){
    if(event.target.id=="editEvent"){
        const clone=event.target.parentElement
        addEditEvent(clone,event.target.parentElement.firstElementChild.textContent) 
    }else if(event.target.id=="deleteEvent"){
        eventMap.delete(event.target.parentElement.firstElementChild.textContent)
        setEvent()
    }else{
        if(event.currentTarget.id=="event"){
            event.currentTarget.querySelector("#editEvent").classList.toggle("active")
            event.currentTarget.querySelector("#deleteEvent").classList.toggle("active")
            event.currentTarget.classList.toggle("green")
        }
    }
}
function addEditEvent(edit,eventname){
    const eventdetail = eventMap.get(eventname)
    const EventList = allEvent.querySelector("#eventList").children
    for(const event of EventList){
        if(event==edit){
            const clone = newEvent.cloneNode(true)
            const payerList = clone.querySelector("#payerList")
            const recieverList = clone.querySelector("#receiverList")
            recieverList.classList.add("active")
            memberMap.forEach((value,name)=>{
                if(eventdetail[0].includes(name)){
                    payerList.innerHTML+="<li>"+name+"<input type='checkbox' checked='true'></li>"
                }else{
                    payerList.innerHTML+="<li >"+name+"<input type='checkbox'></li>"
                }
                if(eventdetail[1].includes(name)){
                    recieverList.innerHTML+="<li class='hidden active'>"+name+"<input type='checkbox' checked='true'></li>"
                }else{
                    recieverList.innerHTML+="<li class='hidden active'>"+name+"<input type='checkbox'></li>"
                }
            })
            clone.querySelector("#newEventName").value=eventname
            clone.querySelector("#newEventName").dataset.oldname=eventname
            clone.querySelector("#newEventCost").value=eventdetail[2]
            clone.querySelector("#addNewEvent").textContent="編集完了"
            clone.querySelector("#deleteNewEvent").textContent="編集中断"
            clone.querySelector("#allCheck").checked=false
            clone.addEventListener("click",editEventclick)
            event.before(clone)
            event.remove()
    }
}}
function editEventclick(event){
    if(event.target.classList[0]=="neweventbutton"){
        if(event.target.id=="addNewEvent"){
            const oldname = event.target.parentElement.querySelector("#newEventName").dataset.oldname
            const spare = eventMap.get(oldname)
            eventMap.delete(oldname)
            try{
                addEvent(event.target.parentElement.children[1])
            }
            catch{
                eventMap.set(oldname,spare)
                addJSON("event",eventMap)
            }
        }
            setEvent()
    }else if(event.target.id=="allCheck"){        
        for(const v of event.target.parentElement.nextElementSibling.children){
            v.classList.toggle("active")
        }
    }
}
function Caluculate(){
    memberMap.forEach((val,name)=>{memberMap.set(name,0)})//初期化
    eventMap.forEach(detail=>{
        memberMap.forEach((val,name)=>{
            if(detail[0].includes(name)){
                memberMap.set(name,val-detail[2]/detail[0].length)
            }
            if(detail[1].includes(name)){             
                memberMap.set(name,memberMap.get(name)+detail[2]/detail[1].length)
            }
        })
    })//memberMapに収支記録
    let payOrder = [["tmpl",Infinity]]
    memberMap.forEach((val,name)=>{
        let i=0
        while(true){
            if(payOrder[i][1]>val){
                if(i+1==payOrder.length){
                    payOrder.push([name,val])
                    break
                }else{
                    i++
                }
            }else{
                payOrder.splice(i,0,[name,val])
                break
            }
        }
    })
    payOrder.shift()//支払い金額の高い順に並び替え
    calculator.children[1].innerHTML=""//result初期化
    for(const [index,[name,val]] of payOrder.entries()){
        if(val>0){
            let i = payOrder.length-1
            while(index<i){
                const stock = payOrder[i][1]
                if(stock!=0){//100円単位にするときは、ここの数値を変えるのかな       
                    payOrder[i][1]+=val
                    if(payOrder[i][1]>0){
                        addResult(name,payOrder[i][0],-stock)
                        payOrder[index][1]=payOrder[i][1]
                        payOrder[i][1]=0
                        i--
                    }else{
                        addResult(name,payOrder[i][0],val)
                        payOrder[index][1]=0
                        break
                    }
                }
            }
        }
    }
}
function addResult(payer,reciever,cost){
    const resultList = calculator.querySelector("#resultList")
    try{
        if(resultList.lastElementChild.querySelector("#payerName").textContent==payer){
            const clone = resultTmpl.children[1].cloneNode(true)
            clone.children[0].textContent=reciever
            clone.children[1].textContent=Math.floor(cost)
            resultList.lastElementChild.append(clone)
        }else{
            throw new Error()
        }
    }catch{
        const clone = resultTmpl.cloneNode(true)
        clone.querySelector("#payerName").textContent=payer
        clone.querySelector("#receiverName").textContent=reciever
        clone.querySelector("#howMuch").textContent=Math.floor(cost)
        resultList.append(clone)
    }
}
function addJSON(type,map){
    localStorage.setItem(type,JSON.stringify([...map]))
}
function lordData(){
    const memberJSON = localStorage.getItem("member")
    const eventJSON = localStorage.getItem("event")
    if(memberJSON&&eventJSON){
        memberMap = new Map(JSON.parse(memberJSON))
        eventMap = new Map(JSON.parse(eventJSON))
        setEvent()
        setMember()
    }
}