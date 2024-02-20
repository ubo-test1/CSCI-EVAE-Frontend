import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Profile from "./components/profile.component";
import UserTest from "./components/user-test";
import AdminTest from "./components/admin-test";
import CommonTest from "./components/common-test"
import Evaluations from "./components/Evaluations";
import { ChakraProvider } from "@chakra-ui/react";
import Evaluation from "./components/Evaluation";
import CreerQualificatif from "./components/CreerQualificatif";
import ConsulterQualificatifs from "./components/ConsulterQualificatifs";
import ModifierQualificatif from "./components/ModifierQualificatif";
import Test from "./components/Test";
import ConsulterRubriques from "./components/ConsulterRubriques";
import CreerRubrique from "./components/CreerRubrique";
import ModifierRubrique from "./components/ModifierRubrique";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined
    });
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
    <ChakraProvider>

      <div>

        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            CSA
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/Login"} className="nav-link">
                Home
              </Link>
            </li>

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/AdminTest"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <>
              <li className="nav-item">
                <Link to={"/userTest"} className="nav-link">
                  User
                </Link>
              </li>
              <li className="nav-item">
              <Link to={"/rubriques"} className="nav-link">
                Rubriques
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/qualificatifs"} className="nav-link">
                Couples qualificatifs
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/evaluations"} className="nav-link">
                Mes évaluations
              </Link>
            </li>
            </>
              
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
              
            </div>

          ) : (
            <div className="navbar-nav ml-auto">
              
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userTest" element={<UserTest />} />
            <Route path="/evaluations" element={<Evaluations/>} />
            <Route path="/evaluations/:id" element={<Evaluation/>} />
            <Route path="/qualificatifs" element={<ConsulterQualificatifs/>} />
            <Route path="/qualificatifs/creer" element={<CreerQualificatif/>} />
            <Route path="/qualificatifs/:id" element={<ModifierQualificatif/>} />
            <Route path="/rubriques" element={<ConsulterRubriques/>} />
            <Route path="/rubriques/creer" element={<CreerRubrique/>} />
            <Route path="/rubriques/:id" element={<ModifierRubrique/>} />
            <Route path="/adminTest" element={<AdminTest />} />
            <Route path="/commonTest" element={<CommonTest />} />
            <Route path="/test" element={<Test />} />

            <Route path="/*" element={<h1>404</h1>} />
          </Routes>
        </div>
      </div>
      </ChakraProvider>
    );
  }
}

export default App;
