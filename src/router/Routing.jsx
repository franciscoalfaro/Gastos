import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { Recovery } from '../components/user/Recovery'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { Consumo } from '../components/user/Consumo'
import { Logout } from '../components/user/Logout'
import { Profile } from '../components/user/Profile'
import { Footer } from '../components/layout/public/Footer'
import { Gastos } from '../components/user/Gastos'
import { Dashboard } from '../components/user/Dashboard'
import { TerminoyCondiciones } from '../components/layout/public/TerminoyCondiciones'

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout></PublicLayout>}>
                        <Route index element={<Login></Login>}></Route>
                        <Route path='login' element={<Login></Login>}></Route>
                        <Route path='registro' element={<Register></Register>}></Route>
                        <Route path='recuperar' element={<Recovery></Recovery>}></Route>
                        <Route path='terminoycondiciones' element={<TerminoyCondiciones></TerminoyCondiciones>}></Route>
                    </Route>

                    <Route path='/auth' element={<PrivateLayout></PrivateLayout>}>
                        <Route index element={<Dashboard></Dashboard>}></Route>
                        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>
                        <Route path='consumo' element={<Consumo></Consumo>}></Route>
                        <Route path='gastos' element={<Gastos></Gastos>}></Route>
                        <Route path='logout'element={<Logout></Logout>}></Route>
                        <Route path='perfil' element={<Profile></Profile>}></Route>
                    </Route>
                    
                    <Route path='*' element={<><h1><p>Error 404 <Link to="/">Volver Al inicio</Link></p></h1></>}></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
