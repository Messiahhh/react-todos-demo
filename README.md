## React(v16) Hook Practice

##### How to Start

```
npm i
npm start
```

##### What features i've use?

Functional Components based Hook API with React-Router-DOM



Some useful Hook used here

```
UseState
UseEffect
UseRef // 管理焦点 / DOM动画 / 集成其他库
UseRouteMatch // 在自定义Link组件的时候比较有用
```



Persist my data

```
let [todos, setTodos] = useState(localStorage.todos ? JSON.parse(localStorage.todos) : [])

useEffect(() => {
        window.localStorage.todos = JSON.stringify(todos)
    }, [todos])

// very convenient
```





