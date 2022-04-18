import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostPage from './pages/PostPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WritePage from './pages/WritePage';
import PostListPage from './pages/PostListPage';

const App = () => {
  return (
    <Routes>
      <Route element={<PostListPage />} path="/" />
      <Route element={<PostListPage />} path="/@:username" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<WritePage />} path="/write" />
      <Route element={<PostPage />} path="/@:username/:postId" />
    </Routes>
  )
}

export default App;