import './index.css'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
} from 'react-router-dom'

function App() {
    return (
        <Router>
            <div>
                <div className="logo">todos</div>
                <Contain />
            </div>
        </Router>

    )
}

function Contain() {
    let [id, setId] = useState(1)
    let [todos, setTodos] = useState(localStorage.todos ? JSON.parse(localStorage.todos) : [])
    // 新建todo
    function createTodo(value) {
        setTodos(todos.concat({
            content: value,
            id: id,
            done: false
        }))
        setId(id + 1)
    }
    // 删除todo
    function deleteTodo(id) {
        let newTodos = todos.slice()
        for(let i = 0; i < todos.length; i++) {
            let todo = todos[i]
            if (todo.id === id) {
                newTodos.splice(i, 1)
                setTodos(newTodos)
            }
        }
    }
    // 修改todo状态
    function toggleTodo(id) {
        let newTodos = todos.slice()
        for(let todo of newTodos) {
            if (todo.id === id) {
                todo.done = !todo.done;
            }
        }
        setTodos(newTodos)
    }
    // 修改todo内容
    function modifyTodo(id, val) {
        let newTodos = todos.slice()
        for (let todo of newTodos) {
            if (todo.id === id) {
                todo.content = val
            }
        }
        setTodos(newTodos)
    }

    function clearTodos() {
        let newTodos = todos.slice()
        newTodos = newTodos.filter((todo) => {
            return todo.done === false
        })
        setTodos(newTodos)
    }

    useEffect(() => {
        window.localStorage.todos = JSON.stringify(todos)
    }, [todos])

    return (
        <div className="contain">
            <Search onCreateTodo={createTodo}/>
            <Todolist todos={todos} onDeleteTodo={deleteTodo} onToggleTodo={toggleTodo} onModifyTodo={modifyTodo} />
            <Footer todos={todos} onClearTodos={clearTodos} />
        </div>
    )
}

function Search(props) {
    let [val, setVal] = useState("")
    function handlerChange(e) {
        setVal(e.target.value)
    }
    function submit(e) {
        if (e.key === 'Enter') {
            props.onCreateTodo(val)
            setVal("")
        }
    }

    return (
        <div className="search">
            <input className="searchInput" placeholder="What needs to be done?" value={val} onChange={handlerChange} onKeyDown={submit}/>
        </div>
    )
}

function Todolist(props) {
    return (
        <div className="todo-lists">
            <Switch>
                <Route path="/" exact>
                    {props.todos.map((todo) => {
                        return <Todo todo={todo} key={todo.id} onDeleteTodo={props.onDeleteTodo} onToggleTodo={props.onToggleTodo} onModifyTodo={props.onModifyTodo}/>
                    })}
                </Route>
                <Route path="/active">
                    {props.todos.map((todo) => {
                        if (!todo.done) {
                            return <Todo todo={todo} key={todo.id} onDeleteTodo={props.onDeleteTodo} onToggleTodo={props.onToggleTodo} onModifyTodo={props.onModifyTodo}/>
                        }
                    })}
                </Route>
                <Route path="/completed">
                    {props.todos.map((todo) => {
                        if (todo.done) {
                            return <Todo todo={todo} key={todo.id} onDeleteTodo={props.onDeleteTodo} onToggleTodo={props.onToggleTodo} onModifyTodo={props.onModifyTodo}/>
                        }
                    })}
                </Route>

            </Switch>
        </div>
    )
}

function Todo(props) {
    let inputEl = useRef(null)

    // 显示内容
    let [showText, setShowText] = useState(true)
    function handlerDoubleClick() {
        setShowText(false)
    }
    // 显示输入框后控制焦点
    useEffect(() => {
        if (!showText) {
            inputEl.current.focus()
        }
    }, [showText])

    let [val, setVal] = useState(props.todo.content)
    function handlerChange(e) {
        setVal(e.target.value)
    }

    function handlerBlur() {
        props.onModifyTodo(props.todo.id, val)
        setShowText(true)
    }

    function handlerEnter(e) {
        if (e.key === 'Enter') {
            props.onModifyTodo(props.todo.id, val)
            setShowText(true)
        }
    }

    let [done, setDone] = useState(props.todo.done)
    let handlerToggle = () => {
        setDone(!done)
        props.onToggleTodo(props.todo.id)
    }
    return (
        <div className="todo">
            {
                showText &&
                <div className="todo-main" >
                    <input type="checkbox" className="todo-toggle" checked={done} onChange={handlerToggle} />
                    <div className="todo-content" onDoubleClick={handlerDoubleClick}>{val}</div>
                    <div className="todo-delete" onClick={() => props.onDeleteTodo(props.todo.id)}>x</div>
                </div>
            }
            {
                showText ||
                <input className="todo-modify" ref={inputEl} value={val} onChange={handlerChange} onBlur={handlerBlur} onKeyDown={handlerEnter} />

            }
        </div>
    )
}



function CustomLink({to, exact, label}) {
    let match = useRouteMatch({
        path: to,
        exact,
    })
    return (
        <div className={`${match ? 'on' : 'off'}`}>
            <Link to={to}>{label}</Link>
        </div>
    )
}
function Footer(props) {
    return (
        <div className="footer">
            <div className='count'>{props.todos.length} items left</div>
            <div className='flex'>
                <CustomLink to="/" exact={true} label="All" />
                <CustomLink to="/active" label="Active" />
                <CustomLink to="/completed" label="Completed" />
            </div>
            <div className="clear" onClick={() => props.onClearTodos()}>ClearCompleted</div>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);




// const EditableField = () => {
//   const [isEditing, setEditing] = useState(false);
//   const toggleEditing = () => {
//     setEditing(!isEditing);
//   };
//
//   const inputRef = useRef(null);
//
//   useEffect(() => {
//     if (isEditing) {
//         console.log(inputRef);
//       inputRef.current.focus();
//     }
//   }, [isEditing]);
//
//   return (
//     <div>
//       {isEditing && <input ref={inputRef} />}
//       <button onClick={toggleEditing}>Edit</button>
//     </div>
//   );
// };
//
// ReactDOM.render(<EditableField />, document.getElementById("root"));


// function Test() {
//     let inputEl = useRef(null)
//
//     let [value, setValue] = useState("")
//
//     let [display, setDisplay] = useState(false)
//     function handlerClick() {
//         setDisplay(true)
//     }
//
//     useEffect(() => {
//         if (display) {
//             inputEl.current.focus()
//         }
//     }, [display])
//
//     return (
//         <div>
//             {
//                 display &&
//                 <input type="text" ref={inputEl} value={value} onChange={(e) => setValue(e.target.value)} />
//             }
//             <button onClick={handlerClick} >change</button>
//         </div>
//     )
// }
//
// ReactDOM.render(
//     <Test />,
//     document.querySelector('#root')
// )
