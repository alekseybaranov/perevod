import {
  ACTION_CHANGE_FIRST_NAME,
  ACTION_CHANGE_SECOND_NAME
} from './actions'


// ----------------------------------------------------------------------------
// Reducer
//
// Reducer - это функция, которая запускается каждый раз, когда происходит 
// действие и генерирует новое состояние на основе старого состояния и действия
// Входящие параметры:    текущее состояние (state) и действие (action)
// Возвращаемое значение: подготовленное новое состояние
//
export const mainReducer = (state, action) => {

  // Обработка изменения имени
  //
  if (action.type === ACTION_CHANGE_FIRST_NAME) {
    return { ...state, firstName: action.payload }
  }

  // Обработка изменения фамилии
  //
  if (action.type === ACTION_CHANGE_SECOND_NAME) {
    return { ...state, secondName: action.payload }
  }

  // Reducer всегда возвращает состояние.
  // Если действие не опознано, то возвращаем текущее состояние
  //
  return state
}
