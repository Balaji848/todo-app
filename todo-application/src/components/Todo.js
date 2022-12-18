import React, { useEffect, useState } from 'react'
import './Todo.css'

const Todo = (props) => {
    // state initialization

    // todo list (render in table)
    const [list,setList] = useState([
        // {
        //     id: 1,
        //     description: 'To master dsa',
        //     category: 'Learning',
        //     isCompleted: false
        // }
    ])

    // filter result
    const [filterResult, setFilterResult] = useState([])
    const [filterBy,setFilterBy] = useState('all')
    const [filterOptions,setFilterOptions] = useState(['all','pending','completed'])
    const [searchTodo,setSearchTodo] = useState('')

    // to add description in todo list (input text description)
    const [inputTodo,setInputTodo] = useState('')

    // to add category in todo list (select drop)
    const [inputCategory,setInputCategory] = useState('')
    const [categoryOptions, setCategoryOptions] = useState(['','Learning','Fitness','Personal','Music'])
    const [isTodoCompleted,setIsTodoCompleted] = useState(false)

    // button visiblity
    const [isEditMode,setIsEditMode] = useState(false)

    // to get the edited record id
    const [editId,setEditID] = useState(-1)

    // local storage
    const LOCAL_STORAGE_TODO_KEY = 'todo.lists'

    useEffect(() => {
        const localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY)) || []
        setList(localList)
        setFilterResult(localList)
    },[])

    useEffect(() => {
        if(filterBy === 'all' && !searchTodo) {
            setFilterResult(list)
        }
    })

    useEffect(() => {
        if(!searchTodo) {
            filterSearchResults(filterBy.toLowerCase())
        }
    },[searchTodo])

    // event handlers

    const formSubmitHandler = (e) => {
        e.preventDefault()
        // alert('form submit')
        if(!isEditMode) {
            // add to list
            if(inputTodo && inputCategory) {
                setList([...list,{
                    id: list.length,
                    description: inputTodo,
                    category: inputCategory,
                    isCompleted: isTodoCompleted
                }])
                localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify([...list,{
                    id: list.length,
                    description: inputTodo,
                    category: inputCategory,
                    isCompleted: isTodoCompleted
                }]))
                setInputCategory('')
                setInputTodo('')
                setIsTodoCompleted(false)
                setFilterBy('all')
            }
        } else {
            // edit a todo
            if(inputTodo && inputCategory) {
                // console.log(editId)
                const editedList = []
                list.forEach((cur,i) => {
                    if(cur.id === editId) {
                        cur.description = inputTodo
                        cur.category = inputCategory
                        cur.id = editId
                        cur.isCompleted = isTodoCompleted
                        editedList.push(cur)
                    } else {
                        editedList.push(cur)
                    }
                })
                // console.log(editedList)
                setList(editedList)
                localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(editedList))
                setInputCategory('')
                setInputTodo('')
                setIsEditMode(false)
                setIsTodoCompleted(false)
                setFilterBy('all')
            }
            // console.log('edit mode')
        }
        // console.log(`Description -> ${inputTodo}`)
        // console.log(`Category -> ${inputCategory}`)
    }

    // edit a todo
    const editTodoHandler = (id) => {
        const selectedTodo = list.find(cur => cur.id === id)
        // console.log(selectedTodo)
        setInputTodo(selectedTodo.description)
        setInputCategory(selectedTodo.category)
        setIsEditMode(true)
        setEditID(id)
        setIsTodoCompleted(selectedTodo.isCompleted)
    }

    // delete a todo
    const deleteTodoHandler = (id) => {
        const filteredLsit = list.filter(cur => cur.id !== id)
        filteredLsit.forEach((cur,i) => {
            cur.id = i
        })
        setList(filteredLsit)
        setFilterBy('all')
        setSearchTodo('')
        localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(filteredLsit))
        // console.log(filteredLsit)
    }

    const chageInputTodoHandler = (e) => {
        setInputTodo(e.target.value)
    }

    const changeCategoryHandler = (e) => {
        // console.log(e.target.value)
        const selectedCategory = e.target.value
        setInputCategory(selectedCategory)
    }

    const categoryCompletionHandler = (e) => {
        const val = e.target.value
        const isCompleted = val.toLowerCase() === 'yes' ? true : false
        // console.log(isCompleted)
        setIsTodoCompleted(isCompleted)
    }

    const filterSearchResults = (filterVal) => {
        switch (filterVal.toLowerCase()) {
            case 'all':
                setFilterResult(list)
                break;
            case 'pending':
                const pendingRecords = list.filter(cur => cur.isCompleted === false)
                // console.log(pendingRecords,'pending')
                setFilterResult(pendingRecords)
                break;
            case 'completed':
                const completedRecords = list.filter(cur => cur.isCompleted === true)
                // console.log(completedRecords,'completed')
                setFilterResult(completedRecords)
                break;
            default:
                setFilterResult(list)
                break;
        }
    }

    const changeFilterOptionsHandler = (e) => {
        // console.log(e.target.value)
        const filterVal = e.target.value
        setFilterBy(filterVal)
        filterSearchResults(filterVal)
    }

    const debounce = (cb,delay) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            },delay)
        }
    }

    const changeSearchTodos = debounce((e) => {
        // console.log(e.target.value)
        const searchVal = e.target.value
        setSearchTodo(searchVal.toLowerCase())
        const searchRecords = filterResult.filter((cur) => {
            const description = cur.description.toLowerCase()
            return description.includes(searchVal)
        })
        setFilterResult(searchRecords)
        // if(!searchVal) {
        //     setFilterBy('all')
        // }
    },2000)
    
    return (
        <div>
            <h2 className='center'>Add Task</h2>
            <form onSubmit={formSubmitHandler} className='add-container'>
                <div>
                    <label htmlFor='add-input'>
                        <strong>Description</strong>
                    </label>
                    {/* <textarea></textarea> */}
                    <input 
                        value={inputTodo} 
                        id='add-input' 
                        type='text' 
                        onChange={chageInputTodoHandler}
                    />
                </div>
                <div>
                    <label htmlFor='todo-category'>
                        <strong>Category</strong>
                        <select value={inputCategory} id='todo-category' onChange={changeCategoryHandler}>
                            {
                                categoryOptions.map((cur,i) => {
                                    return (
                                        <option key={i}>{cur}</option>
                                    )
                                })
                            }
                        </select>
                    </label>
                </div>
                <div>
                    <label>Task Completed ? </label>
                    <input type='radio' checked={isTodoCompleted} name='category' value='Yes' id='yes' onChange={(e) => categoryCompletionHandler(e)} />
                    <label htmlFor='yes'>Yes</label>
                    <input type='radio' checked={!isTodoCompleted} name='category' value='No' id='no' onChange={(e) => categoryCompletionHandler(e)}/>
                    <label htmlFor='no'>No</label>
                </div>
                {
                    !isEditMode && <div>
                        <button type='submit'>Add Todo</button>
                    </div>
                }
                {
                    isEditMode && <div>
                        <button type='submit'>Update</button>
                    </div>
                }
            </form>
            <h2 className='center'>Todo</h2>
            <div className='filter-cotainer'>
                <div>
                    <label htmlFor='filter-options'>
                        <h3>Filter the Todo by</h3>
                    </label>
                    <div>
                        <select id='filter-options' value={filterBy} onChange={changeFilterOptionsHandler}>
                            {filterOptions.map((cur,i) => {
                                return (
                                    <option value={cur} key={i}>{cur}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <input type='text' onChange={changeSearchTodos} />
                </div>
            </div>
            <table>
                <thead>
                    <tr className='center'>
                        <th>S.No</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className='center'>
                    {
                        filterResult.map((cur,i) => {
                            return (
                                <tr key={i+1}>
                                    <td>{i+1}</td>
                                    <td>{cur.category}</td>
                                    <td>{cur.description}</td>
                                    <td>{cur.isCompleted ? 'Completed' : 'Pending'}</td>
                                    <td className='action-btns'>
                                        <button onClick={() => editTodoHandler(cur.id)}>Edit</button>
                                        <button onClick={() => deleteTodoHandler(cur.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>
        </div>
    )
}

export default Todo