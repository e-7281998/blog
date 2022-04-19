import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button'
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

// 회원가입 또는 로그인 폼을 보여줍니다.

const AuthFormBlock = styled.div`
    h3 {
        magin: 0;
        color: ${palette.gray[8]};
        margin-bottom: 1rem;
    }
`;
//스타일링 된 input
const StyledInput = styled.input`
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid ${palette.gray[15]};
    padding-bottom: 0.5rem;
    outline: none;
    width: 100%;
    &:focus {
        color: ${palette.gray[7]} ;
        border-bottom: 1px solid ${palette.gray[7]};
    }
    & + & {
        margin-top: 1rem;
    }
`;

const Footer = styled.div`
    margin-top: 2rem;
    text-align: right;
    a {
        color: ${palette.gray[6]};
        text-decoration: underline;
        &:hover {
            color: ${palette.gray[9]};
        }
    }
`;

const ButtonWithMarginTop = styled(Button)`
margin-top: 1rem;
`

const textMap = {
    login: '로그인',
    register: '회원가입',
};

const AuthForm = ({ type }) => {
    const text = textMap[type];
    return (
        <AuthFormBlock>
            <h3>{text}</h3>
            <form>
                <StyledInput autoComplete="username" name="username" placeholder="아이디" />
                <StyledInput
                    autoComplete="new-password"
                    name="password"
                    placeholder="비밀번호"
                    type="password"
                />
                {type === 'register' && (
                    < StyledInput
                        autoComplete="new-password"
                        name="passwordConfirm"
                        placeholder="비밀번호 확인"
                        type="password"
                    />
                )}
                <ButtonWithMarginTop cyan fullWidth>{text}</ButtonWithMarginTop>
            </form>
            <Footer>
                {type === 'login' ? (
                    <Link to="/register">회원가입</Link>
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </Footer>
        </AuthFormBlock>
    )
};

export default AuthForm;