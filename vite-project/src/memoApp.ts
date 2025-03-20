export const memoApp = () => {

  let table:HTMLTableElement | null
  let message:HTMLInputElement | null
  
  //テーブルに生成内容を表示
  function showTable(html:string) {
    if(!table){
      console.error('table要素がない')
      return;
    }
    table.innerHTML = html
  }
  
  //フォームの入力
  function doAction() {
    if(!message){
      console.error('message要素がまだない')
      return;
    }
    const msg = message.value
    if(!msg){
      alert('文字を入力してください')
      return;
    }
    memo.add({message:msg,date:new Date()})
    memo.save()
    memo.load()
    showTable(memo.getHTML())  
  }
  
  //フォーム初期化
  function doInitial() {
    if(!message){
      console.error('message要素がまだない')
      return;
    }
    const confirmDelete = confirm('本当にすべて消しますか？')
    if(!confirmDelete) return;
    memo.data = []
    memo.save()
    memo.load()
    message.value = ''
    showTable(memo.getHTML())
  }
  
  //メモ型エイリアス
  type Memo = {
    message:string,
    date: Date
  }
  
  //メモデータをローカルストレージから読み書きしてDOMを書き換える
  class MemoData {
    data:Memo[] = []
    add(mm:Memo):void {
      this.data.push(mm)
    }

    //stringでないと保存できない
    save():void {
      localStorage.setItem('memo-data',JSON.stringify(this.data))
    }
    
    //stringからDateオブジェクトに変換しないとtoLocaleStringが使えない？
    load(): void {
      //テキストの内容は↓だがこれだと日付が日本時間にならなかった…
      // const readed = localStorage.getItem('memo-data');
      // this.data = readed ? JSON.parse(readed) : [];
      const readed = localStorage.getItem('memo-data');
      this.data = readed ? JSON.parse(readed).map((item: { message: string, date: string }) => ({
        message: item.message,
        date: new Date(item.date) // 文字列をDateオブジェクトに変換
      })) : [];
    }
  
    getHTML():string {
      let html = `
      <thead>
        <th>memo</th>
        <th>date</th>
      </thead>
      <tbody>`
      for(let item of this.data) {
        html += `<tr><td>` + item.message + `</td><td>`+
        item.date.toLocaleString('ja-JP') + `</td></tr>` 
      }
      return html + `</tbody>`
    }
  }
  
  const memo = new MemoData()
  window.addEventListener('load', ()=>{
    table =document.querySelector('#table')
    message = document.querySelector('#message')
    document.querySelector('#btn')?.addEventListener('click',doAction)
    document.querySelector('#initial')?.addEventListener('click',doInitial)
    memo.load()
    showTable(memo.getHTML())
  })
}