const memberMap = new Map()
const eventMap = new Map()

const newMemberForm = document.querySelector("#newMember")
const allMember = document.querySelector("#allMember")
const allEvent = document.querySelector("#allEvent")
const newEvent = document.querySelector("#newEventTmpl").content.firstElementChild
const eventTmpl = document.querySelector("#eventTmpl").content.firstElementChild

newMemberForm.addEventListener("submit",event=>{
    event.preventDefault()
    addMember()
    newMemberForm.children[0].value=""
    setMember()
})
allMember.addEventListener("click",event=>{
    if(event.target.id=="deleteMember"){
        if(confirm("選択したメンバーを削除しますか？")){
            for(const v of allMember.children[1].querySelectorAll("input")){
                if(v.checked){
                    memberMap.delete(v.parentElement.textContent)
                    v.parentElement.remove()
                }
            }
        }
    }
    if(event.target.id=="showMember"){
        showMember()
    }
    showDeleteButton()
})
allEvent.children[2].addEventListener("click",()=>{
    if(memberMap.size){
        createEvent()
    }
})
function addMember(){
    const member = newMemberForm.children[0].value
    if(member){
        if(memberMap.has(member)){
            alert("同じ名前のメンバーがすでにいます！")
        }else{
            memberMap.set(member,0)
        }
    }
}
function setMember(){
    allMember.children[1].textContent=""
    memberMap.forEach((value,name)=>{
        allMember.children[1].innerHTML+="<li>"+name+"<input id='checkMember' type='checkbox'></li>"
    })
}
function showMember(){
    const memberList = allMember.children[0]
    allMember.children[1].classList.toggle("hidden")
    if(memberList.textContent=="メンバーを表示する"){
        memberList.textContent="メンバーを非表示する"
    }else{
        memberList.textContent="メンバーを表示する"
    }
}
function showDeleteButton(){
    allMember.children[2].classList.add("hidden")
    if(allMember.children[0].textContent=="メンバーを非表示する"){
        for(const v of allMember.children[1].querySelectorAll("input")){
            if(v.checked){
                allMember.children[2].classList.remove("hidden")
                break
            }
        }
    }
}
function createEvent(){
    const clone = newEvent.cloneNode(true)
    const payerList = clone.querySelector("#payerList")
    const recieverList = clone.querySelector("#receiverList")
    clone.children[1].children[2].children[0].innerHTML="全員<input id='allCheck' type='checkbox' checked='true'>"
    memberMap.forEach((value,name)=>{
        payerList.innerHTML+="<li>"+name+"<input type='checkbox'></li>"
        recieverList.innerHTML+="<li>"+name+"<input type='checkbox'></li>"
    })
    clone.addEventListener("click",newEventclick)
    allEvent.children[3].append(clone)
}
function newEventclick(event){
    if(event.target.classList[0]=="neweventbutton"){
        if(event.target.id=="addNewEvent"){
            addEvent(event.target.parentElement.children[1])
            setEvent()
        }
        event.currentTarget.remove()//登録されてるのがliだからそれが消える。
    }else if(event.target.id=="allCheck"){
        event.target.parentElement.nextElementSibling.classList.toggle("hidden")
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
        }else{
            alert("支払い金額が正しくありません")
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
        clone.querySelector("#detail").textContent=detail[0]+"が"+detail[1]+"の分を支払い、"+detail[2]+"円かかった。"
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
            event.currentTarget.querySelector("#editEvent").classList.toggle("hidden")
            event.currentTarget.querySelector("#deleteEvent").classList.toggle("hidden")
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
            recieverList.classList.remove("hidden")
            clone.children[1].children[2].children[0].innerHTML="全員<input id='allCheck' type='checkbox'>"
            memberMap.forEach((value,name)=>{
                if(eventdetail[0].includes(name)){
                    payerList.innerHTML+="<li>"+name+"<input type='checkbox' checked='true'></li>"
                }else{
                    payerList.innerHTML+="<li>"+name+"<input type='checkbox'></li>"
                }
                if(eventdetail[1].includes(name)){
                    recieverList.innerHTML+="<li>"+name+"<input type='checkbox' checked='true'></li>"
                }else{
                    recieverList.innerHTML+="<li>"+name+"<input type='checkbox'></li>"
                }
            })
            clone.querySelector("#newEventName").value=eventname
            clone.querySelector("#newEventName").dataset.oldname=eventname
            clone.querySelector("#newEventCost").value=eventdetail[2]
            clone.querySelector("#addNewEvent").textContent="編集完了"
            clone.querySelector("#deleteNewEvent").textContent="編集をやめる"
            clone.addEventListener("click",editEventclick)
            event.before(clone)
            event.remove()
        }else{
            console.log("みつけられん")
        }
    }
}
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
            }
            setEvent()
        }
        setEvent()
    }else if(event.target.id=="allCheck"){
        event.target.parentElement.nextElementSibling.classList.toggle("hidden")
    }
}
//setEventの前に編集中のイベントないか確認