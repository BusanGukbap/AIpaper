import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';

/**
 * 회원가입 페이지
 * @param {*} param0
 * @returns JSX.Element
 */

const qs = (sel) => document.querySelector(sel);

function LoginPage({ /* onSignUp, onSignIn */ }) {
    const navigate = useNavigate();

    const goToHome = () => { 
        navigate("/");
      }

    const createHeader = (id, pw) => ({
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ id, pw }),
    })

    const preventEvent = (handler) => (event) => {
        event.preventDefault();
        handler(event);
    }

    const handleSignUp = async (id, pw) => {
        const response = await fetch("http://localhost:5010/api/sign_up", createHeader(id, pw));
        const result = await response.json();
        console.log(result);
    };

    // 로그인
    const handleSignIn = async (event) => {
        console.log("fetch");
        const id = qs('input[name="sign-in-id"]');
        const pw = qs('input[name="sign-in-pw"]');
        id.value = pw.value = '';
        
        const response = await fetch("http://localhost:5010/api/sign_in", createHeader(id.value, pw.value));
        const result = await response.json();
        console.log(result);
        // onSignIn(); // 부모 컴포넌트의 로그인 성공 핸들러 호출
    }

    return (
        <div>
            <Button type = "submit" text = "Home" onClick={goToHome}/>
            <h1> Sign Up </h1>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    // handleSignUp(id, pw);
                }}
            >
                <input type="text" name="id" placeholder="ID" />
                <input type="password" name="pw" placeholder="PW" />
                <button type="submit">Sign Up</button>
            </form>

            <h1> Sign In </h1>
            <form
                onSubmit={preventEvent(handleSignIn)}
            >
                <input type="text" name="sign-in-id" placeholder="ID" />
                <input type="password" name="sign-in-pw" placeholder="PW" />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default LoginPage;