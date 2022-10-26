const url = 'http://localhost:8080/api/';

const todoRoot = document.getElementById('todoRoot');

/*
 * GET 
 */
const getToDos = () => {
  fetch(url + 'todos', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then(array => {
      // obj は受信したJSON文字列をJavaScriptのオブジェクトへ変換した値
      console.log(array);
      todoRoot.innerHTML = ''; // 全てのToDo表示をクリア
      array.forEach(todo => {
        // 配列から todo を一つずつ取り出して、div要素を作成
        const todoElm = document.createElement('div');
        todoElm.id = `item_${todo.id}`;        
        todoElm.innerHTML = `${todo.id}, ${todo.title}, ${todo.completed}`;
        todoRoot.appendChild(todoElm);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

/*
 * POST 
 */
const postTodo = () => {
  const newTodo = {
    title: document.getElementById('todoTitle').value,
  };
  fetch(url + 'todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then(todo => {
      console.log(todo);
      // todoRoot へ新規ToDoを追加
      const todoElm = document.createElement('div');
      todoElm.id = `item_${todo.id}`;
      todoElm.innerHTML = `${todo.id}, ${todo.title}, ${todo.completed}`;
      todoRoot.appendChild(todoElm);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*
 * PUT 
 */
const putTodo = () => {
  const updatedTodo = {
    title: document.getElementById('todoTitle').value,
  };
  const itemId = document.getElementById('itemId').value;
  if (itemId === null) return;
  fetch(url + 'todos/' + itemId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedTodo),
  })
    .then((response) => {
      if(response.ok) return response.json()
      throw response.statusText;
    })
    .then(todo => {
      console.log(todo);
      const todoElm = document.getElementById(`item_${todo.id}`);
      todoElm.id = `item_${todo.id}`;
      todoElm.innerHTML = `${todo.id}, ${todo.title}, ${todo.completed}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*
 * DELETE 
 */
const deleteTodo = () => {
  const updatedTodo = {
    title: document.getElementById('todoTitle').value,
  };
  const itemId = document.getElementById('itemId').value;
  if (itemId === null) return;
  fetch(url + 'todos/' + itemId, {
    method: 'DELETE',
  })
    .then((response) => {
      if(response.ok) return response.json()
      throw response.statusText;
    })
    .then(todo => {
      console.log(todo);
      const todoElm = document.getElementById(`item_${todo.id}`);
      todoRoot.removeChild(todoElm);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// ページがロードされたらサーバからToDoリスト読み込み
getToDos();

document.getElementById('postButton').addEventListener('click', () => {
  postTodo();
});

document.getElementById('putButton').addEventListener('click', () => {
  putTodo();
});

document.getElementById('deleteButton').addEventListener('click', () => {
  deleteTodo();
});

