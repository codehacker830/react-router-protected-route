import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation,
} from "react-router-dom";

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

export default function AuthExample() {
    return (
        <Router>
        <div>
            <AuthButton />
            <ul>
                <li>
                    <Link to="/public">Public Page</Link>
                </li>
                <li>
                    <Link to="/protected1">Protected Page 1</Link>
                </li>
                <li>
                    <Link to="/protected2">Protected Page 2</Link>
                </li>
            </ul>
            <Switch>
                <Route path="/public">
                    <PublicPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <PrivateRoute path="/protected1" component={ProtectedPage1} />
                <PrivateRoute path="/protected2" component={ProtectedPage2} />
            </Switch>
        </div>
        </Router>
    );
}

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 1000); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 1000);
    },
};

function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <p>
        Welcome!{" "}
        <button
            onClick={() => {
            fakeAuth.signout(() => history.push("/"));
            }}
        >
            Sign out
        </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute(props) {
    console.log("props : ", props);
    const {component : Component, ...rest} = props; 
    // There are props from Parent Component....
    // path: "/protected"
    // children: {$$typeof: Symbol(react.element), key: null, ref: null, props: {…}, type: ƒ, …}
    // location: {pathname: "/protected", search: "", hash: "", state: undefined, key: "z5imwx"}
    // computedMatch: {path: "/protected", url: "/protected", isExact: true, params: {…}}

    return (
        <Route
                // {...rest}
            render={(props) => {
                console.log("Route render props : ", props);
                console.log("PrivateRoute location : ", props.location);
                return fakeAuth.isAuthenticated ? (
                    <Component />
                ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        from: {pathname : props.location.pathname}
                    }}
                />
                )
            }
            }
        />
    );
}

function PublicPage() {
    return <h3>Public page</h3>;
}

function ProtectedPage1() {
    return <h3>Protected page 1</h3>;
}

class ProtectedPage2 extends React.Component {
    render() {
        return <h3>Protected page 2</h3>;
    }
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    console.log("___ redirected login page location from ___", location);
    let from = location.from || { pathname: "/" };
    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log in</button>
        </div>
    );
}
