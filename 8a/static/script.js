const url = 'http://localhost:8080/api/';

const todoRoot = document.getElementById('todoRoot');
// const todoRoot = document.querySelector('#todoRoot'); // こう書いても良い。なお、あまりタイピング量は変わらない。

const appendToDo = todo => {
  const todoElm = document.createElement('div');
  todoElm.id = `item_${todo.id}`;        
  todoElm.innerHTML = `${todo.id}, ${todo.title}, ${todo.completed}`;
  todoRoot.append(todoElm);
};

/*
 * GET 
 */
const getToDos = () => {
  fetch(url + 'todos', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then(array => {
      // array は受信したJSON文字列をJavaScriptのオブジェクト型データへ変換した値。
      // 今回の場合は配列
      console.log(array);
      todoRoot.innerHTML = ''; // 全てのToDo表示をクリア
      array.forEach(todo => {
        // 配列から todo を一つずつ取り出して、div要素を作成
        appendToDo(todo);
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
      appendToDo(todo);
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
    completed: document.getElementById('todoCompleted').checked,
  };
  if (document.getElementById('todoTitle').value !== '') {
    updatedTodo.title = document.getElementById('todoTitle').value;
  }
  
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
      todoElm.remove();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*
 * 追加、更新、削除操作
 */
document.getElementById('postButton').addEventListener('click', () => {
  postTodo();
});

document.getElementById('putButton').addEventListener('click', () => {
  putTodo();
});

document.getElementById('deleteButton').addEventListener('click', () => {
  deleteTodo();
});

 /* 
  * 機能の切り替え
  */
document.getElementById('listMode').addEventListener('click', () => {
  openListMode();
});

document.getElementById('profileMode').addEventListener('click', () => {
  openProfileMode();
});

document.getElementById('configMode').addEventListener('click', () => {
  openConfigMode();
});

const openListMode = () => {
  history.pushState({}, null, '/');
  // ToDoリスト読み込み
  getToDos();
  document.getElementById('list').style.display = 'block';
  document.getElementById('profile').style.display = 'none';
  document.getElementById('config').style.display = 'none';
};

const openProfileMode = () => {
  history.pushState({}, null, 'profile');
  document.getElementById('list').style.display = 'none';
  document.getElementById('profile').style.display = 'block';
  document.getElementById('config').style.display = 'none';
};

const openConfigMode = () => {
  history.pushState({}, null, 'config');
  document.getElementById('list').style.display = 'none';
  document.getElementById('profile').style.display = 'none';
  document.getElementById('config').style.display = 'block';
}

/*
 * 現在のURLによって開く機能を変える
 */
const router = () => {
  if (window.location.pathname === '/' || window.location.pathname === '/index.html'){
    openListMode();
  }
  else if(window.location.pathname === '/profile'){
    openProfileMode();
  }
  else if(window.location.pathname === '/config'){
    openConfigMode();
  }
};

// ページがロードされたら、URLに応じた機能を開く
router();