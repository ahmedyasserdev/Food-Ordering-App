import React from 'react'
import CartItems from './_components/CartItems'
import CheckoutForm from './_components/CheckoutForm'

const CartPage = () => {
  return (
    <section className='section-gap' >
            <div className="container">
                <h1 className="text-4xl text-primary font-bold italic mb-10 text-center ">
                    Cart
                </h1>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                        <CartItems />
                        <CheckoutForm />
                    </div>


            </div>

    </section>
  )
}

export default CartPage