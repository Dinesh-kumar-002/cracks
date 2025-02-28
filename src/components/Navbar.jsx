import React from 'react'
import {Flex, Text } from '@radix-ui/themes'
import { Switch } from "radix-ui";
import { BsCart } from "react-icons/bs";
import theme from '../store/theme'
import cartStore from '../store/cartStore';
import cartToggle from "../store/cartToggle";

function Navbar() {
    const { cartStatus, cartStatusToggle } = cartToggle();
  const {toggleTheme } = theme();
  const {cart} = cartStore();
  return (
    <>
        <div className="flex justify-between p-5 sticky top-0 w-full z-10" style={{background:"rgb(0 144 255)"}}>
            <div className="logo">
                <h2>VMPS Crackers</h2>
            </div>
            

            <div className='flex relative'>   
                
                <Flex style={{fontSize:"20px",marginRight:"30px",position:'relative'}} data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example">
                    <Text as="p" size="1" className='absolute qnt-show'>{cart.length}</Text>
                    <button onClick={()=>cartStatusToggle()}><BsCart/></button>
                </Flex>

            <Switch.Root className="SwitchRoot" onCheckedChange={toggleTheme} >
                <Switch.Thumb className="SwitchThumb" />
            </Switch.Root>
            </div>

        </div>
        
    </>
  )
}

export default Navbar