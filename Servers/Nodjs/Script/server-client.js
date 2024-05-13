export class HttpClient {
    baseUrl = "http://localhost:3000";
    todoGeneralUrl = `${this.baseUrl}/todos`;
    async getAllToDoItems() {
  return await fetch(this.todoGeneralUrl)
    .then(response => response.json());
    }
    addNewItem(text, success) {
        const data = {
            text: text,
            done: false
        };
        fetch(this.todoGeneralUrl, {
  method: "POST",
  headers: {
      "Content-Type": "application/json"
  },
        body: JSON.stringify(data)
    }).then(() => success());
    }
}
