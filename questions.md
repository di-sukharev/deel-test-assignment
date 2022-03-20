# QUESTIONS

## Question 1

What is the difference between Component and PureComponent? give an example where it might break my app.

### Answer 1

The difference is one — React.PureComponent doesn't rerender if shallowly compared props and state haven't changed.

So, React.PureComponent handles `shouldComponentUpdate` method for you and React.Component does not.

But if you use context with PureComponent and change context value, it can be skipped by PureComponent or it's children due to the fact that it doesn't rerender and might not update the context value. That's how it can break your app.

---

## Question 2

Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

### Answer 2

I've just answered that in the first question above.

---

## Question 3

Describe 3 ways to pass information from a component to its PARENT.

### Answer 3

1. callback function passed as a prop to child component from parent component. You just call this function in child component with a value you need to pass to parent component.
2. you can also use redux — dispatch an action with a value and get the value using selector in the parent component.
3. and you can use context similarly to redux — pass callback to child components via context and update context data with this callback, code example below:

```js
const Context = React.createContext();

const ChildComponent = () => {
  const [data, setData] = useContext(Context);

  return (
    <div onClick={() => setData("I'm passing data to parent")}>hey there</div>
  );
};

function App() {
  const [data, setData] = useState();

  return (
    <Context.Provider value={[data, setData]}>
      <ChildComponent />
      <p>{data}</p>
    </Context.Provider>
  );
}
```

---

## Question 4

Give 2 ways to prevent components from re-rendering.

### Answer 4

1. using React.PureComponent
2. using shouldComponentUpdate manually
3. you can also use `useCallback` in parent component and pass memoized function to child, so child component doesn't rerender when parent creates new instance of the function while rerendering.

---

## Question 5

What is a fragment and why do we need it? Give an example where it might break my app.

### Answer 5

`<React.Fragment>[multiple elements here]</React.Fragment>` or it's shortcut `<>[multiple elements here]</>` is used to return multiple elements from the component without wrapping them in an extra div.

I don't know how React.Fragment can break an app 😕

---

## Question 6

Give 3 examples of the HOC pattern.

### Answer 6

HOCs were used in class components to share common code before hooks were introduced to functional components.

HOCs examples are down below.

Example 1 — fetch api on componentDidMount:

```js
export default function WithUserHOC(Component) {
    return class extends Component {
        constructor() {
            this.state = { user: null }
        }

        componentDidMount() {
            fetch("api/user", { method: 'GET' })
                .then(res => res.json())
                .then(json => this.setState({ user: json }));
        }

        render() {
            return <Component user={this.state.user} />;
        }
    }
}

class App extends Component {
  render() {
    return (
      <div>
        your username is {this.props.user.name}
      </div>
    )
  }
}

export default WithUserHOC(App);
```

Example 2 — inject a method:

```js
export default function WithUpdateUser(Component) {
    return class extends Component {
        constructor() {
            this.state = { user: null }
        }

        updateUser(data) {
            fetch("api/user", {
                    method: 'POST', body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(json => this.setState({ user: json }));
        }

        render() {
            return <Component
                user={this.state.user}
                updateUser={this.updateUser} />;
        }
    }
}

class App extends Component {
    constructor() {
        this.state = { username: '' }
    }

    handleUpdateUser(username) {
        this.props.updateUser(this.state.username);
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    onChange={(e) => this.setState({username: e.target.value})}
                />
                <button onClick={this.handleUpdateUser}>
                    update user data
                </button>
            </div>
        )
    }
}

export default WithUpdateUser(App);
```

I can't think of any more examples of using the HOC pattern. So, I hope 2 examples are enough.

---

## Question 7

What's the difference in handling exceptions in promises, callbacks and async...await.

### Answer 7

In promises you use `.catch(err => handleError(err))` in the end of the promise chain, example below:

```js
fetch("https://this-url-does-not-exist.com") // rejects
  .then((response) => response.json())
  .catch((err) => console.log(err)); // handle error
```

In async/await functions you handle exceptions using `try/catch`, example below:

```js
const example = async () => {
  try {
    const response = await fetchSomeApi();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
```

In callbacks you usually pass error to one of the arguments of the callback, example below:

```js
const someFunction = (arg, callback) => {
  if (typeof arg !== "string") {
    return callback(null, new Error("invalid arg type"));
  }
  // do something else …
  callback(result);
};

someFunction(1, (result, error) => {
  if (error) console.error(error);
  else {
    console.log(result);
  }
});
```

---

## Question 8

How many arguments does setState take and why is it async.

### Answer 8

Well I know only about one argument — the new state: `setState(newState)`. And this one argument can also be a function `(oldState) => newState`.

`setState` triggers rerendering, it can be expensive on large DOM trees and so freeze a browser, that's why it's async.

---

## Question 9

List the steps needed to migrate a Class to Function Component.

### Answer 9

1. rewrite class component syntax to function component syntax: remove constructor, change render method to simple JSX return, remove `this.` references
2. migrate class lifecycle methods to hooks
3. migrate class methods to functions

---

## Question 10

List a few ways styles can be used with components.

### Answer 10

1. inline styles with style property: `style={{color: 'red'}}`
2. using className property: `className="some-class"`
3. styled-components library

---

## Question 11

How to render an HTML string coming from the server.

## Answer 11

Well, you can use `dangerouslySetInnerHTML={{__html: htmlStringFromTheServer}}`. But this way is vulnerable to XSS attacks, so you need to sanitize html before rendering it via `dangerouslySetInnerHTML`.
