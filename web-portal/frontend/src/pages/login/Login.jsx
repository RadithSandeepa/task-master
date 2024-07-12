import "./login.scss";
import Lottie from 'lottie-react';
import animationData from '../../animations/todoAnimation.json';
import { motion } from "framer-motion";

const LoginPage = () => {
    return (
        <div className="login">
            <div className="left">
                <h1>Welcome to TaskMaster!</h1>
                <p>Empowering Your Productivity Journey</p>
                <motion.button  onClick={() => window.location.href = "/auth/login"} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Login</motion.button>
            </div>
            <div className="right">
                <div className="animation">
                    <Lottie animationData={animationData} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
