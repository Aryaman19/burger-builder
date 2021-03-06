import React, { Component } from 'react'
import Aux from '../../hoc/Auxillary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import instance from '../../axios-orders';

const INGREDIENT_PRICE = {
    salad : 0.5,
    cheese: 0.4,
    meat: 1,
    bacon : 1.5
}

class BurgerBuilder extends Component {

      state = {
         ingredients :{
             salad : 0,
             bacon:0,
             cheese:0,
             meat:0
         },
         totalPrice:4,
         purchasable:false,
         purchasing:false

      }

      updatePurcahseState(ingredients){
          
        const sum = Object.keys(ingredients)
          .map(igkey => {
              return ingredients[igkey]
          })
          .reduce((sum,el)=>{
              return sum+el;
          },0);
          this.setState({purchasable:sum>0})
      }

      addIngredientHandler = (type)=>{
          const oldCount =this.state.ingredients[type];
          const updatedCount = oldCount + 1;
          const updatedIngredients = {
              ...this.state.ingredients
          };
          updatedIngredients[type]=updatedCount;
          const priceAddition = INGREDIENT_PRICE[type];
          const oldPrice = this.state.totalPrice;
          const newPrice = oldPrice+priceAddition;
          this.setState({totalPrice:newPrice , ingredients:updatedIngredients});
          this.updatePurcahseState(updatedIngredients);
      }

      removeIngredientHandler = (type)=>{
        const oldCount =this.state.ingredients[type];
        if(oldCount <= 0){return}
           
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice , ingredients:updatedIngredients})
        this.updatePurcahseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = () =>{
       // alert('Continue Your Purchase')
       const order = {
           ingredients:this.state.ingredients,
           price : this.state.totalPrice,
           customer: {
               name : 'Aryaman Kumar',
               address:{
                 street: 'test street' , 
                zipcode : '482008',
                country: 'India'},
                email: 'test@test.com'
               },
               deliveryMethod: 'fastest'
               };

          instance.post('https://react-burger-builder-49da6.firebaseio.com/orders.json',order )
                  .then(response => console.log(response))
                  .catch(err => console.log(err))
    }

    render() {
        
        const disabledInfo = {
            ...this.state.ingredients
        } 
        for(let key in disabledInfo){
                disabledInfo[key] = disabledInfo[key] <= 0
        }


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                    ingredients = {this.state.ingredients}
                    purchaseCancelled = {this.purchaseCancelHandler}
                    purchaseContinued = {this.purchaseContinueHandler}
                    price={this.state.totalPrice}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                ingredientsAdded = {this.addIngredientHandler}
                ingredientsRemoved = {this.removeIngredientHandler}
                purchasable = {this.state.purchasable}
                disabled = {disabledInfo}
                ordered={this.purchaseHandler}
                price = {this.state.totalPrice}/>
            </Aux> 
            
        )
    }
}

export default BurgerBuilder
