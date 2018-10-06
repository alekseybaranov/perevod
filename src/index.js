import 'react-app-polyfill/ie11'    // поддержка IE11
//import 'react-app-polyfill/ie9'   // поддержка IE9
// Подключение react-app-polyfill для поддержки IE11 или IE9
// !!! ОБЯЗАТЕЛЬНО !!!   Строка импорта должна быть первой в файле


import React from 'react'
import ReactDOM from 'react-dom'

import { createStore,
         applyMiddleware } from 'redux'
import { Provider } from 'react-redux'


import App from './components/App'                // Компонент приложения
import { mainReducer } from './store/reducers'    // Преобразователь (reducer)


// ключ, под которым будут сохраняться данные в localStorage
const localStorageKey = 'perevod-data'


// ----------------------------------------------------------------------------
// Промежуточное ПО для хранилища

// logger -----------------------------------
//        регистратор изменений
//
const logger = store => next => action => {
  // код, который выполняется до выполнения действия
  let result
  console.groupCollapsed("dispatching", action.type)
  console.log('prev state', store.getState())
  console.log('action', action)

  // выполняем действие
  result = next(action)

  // код, который вызывается после выполнения действия
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

// saver  -----------------------------------
//        сохранение данных в localStore
//
const saver = store => next => action => {
  // код, который выполняется до выполнения действия

  // выполняем действие
  let result = next(action)

  // код, который вызывается после выполнения действия
  localStorage[localStorageKey] = JSON.stringify(store.getState())
  return result
}



// ----------------------------------------------------------------------------
// Store (Хранилище)
//
// Store - это объект, в котором хранятся текущие данные состояния приложения
//         и обрабатываются все обновления состояния.
//
// Хранилище обрабатывает обновление состояния, пропуская текущее состояние
// и действие через единый преобазователь данных (reducer), который передаётся
// функции создания хранилища 'createStore' в качестве параметра.
//
// Метод хранилища 'getState' возвращает текущее состояние приложения.
//

// Начальное состояние  -----------------------------
//
const initialState = {
  firstName: 'Paul',
  secondName: 'Petrov'
}

// storeFactory  ------------------------------------
//        фабрика создания хранилища с регистрацией промежуточного ПО
//
const storeFactory = (initialState) =>
  applyMiddleware(logger, saver)(createStore)(      // подключаем промеж-ное ПО
    mainReducer,                                    // редюсер
    (localStorage[localStorageKey]) ?               // загружаем состояние из 
      JSON.parse(localStorage[localStorageKey]) :   // локального хранилища
      initialState                                  // или начальное состояние
  )

// Создаём хранилище  -------------------------------
//
const store = storeFactory(initialState)


// ----------------------------------------------------------------------------
// Объект 'Provider' добавляет хранилище к контексту и обновляет компонент App
// после диспетчеризации действий.
// Провайдеру нужен один дочерний компонент (в нашем случае - App).
// Хранилище передаётся провайдеру в виде свойства.
//
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'))
