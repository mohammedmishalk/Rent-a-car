import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk'
import { alertsReducer } from './reducers/alertReducer';
import { carsReducer } from './reducers/carReducer';
const composeEnchacncers=composeWithDevTools({

})

const rootReducer=combineReducers({
 carsReducer,
 alertsReducer
})


const store = createStore(
    rootReducer,
    composeEnchacncers(
    applyMiddleware(thunk)
    // other store enhancers if any
  )
);


export default store