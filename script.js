const memberMap = new Map()
const eventMap = new Map()

const newMemberForm = document.querySelector("#newMember")
const allMember = document.querySelector("#allMember")
const allEvent = document.querySelector("#allEvent")
const newEvent = document.querySelector("#newEventTmpl").content.firstElementChild

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
    }else{
        alert("メンバーを追加してください！")
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
    const payerList = clone.children[1].children[1].firstElementChild
    const recieverList = clone.children[1].children[2].children[1]
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
        }
        event.currentTarget.remove()
    }else if(event.target.id=="allCheck"){
        event.target.parentElement.nextElementSibling.classList.toggle("hidden")
    }
}
function addEvent(ul){
    if(typeof ul.querySelector("#newEventCost").value=="Number"){
        eventMap.set(ul.querySelector("#newEventName"),ul.querySelector("#newEventCost"))
        console.log(eventMap)
    }else{
        alert("支払い金額が正しくありません")
    }
}