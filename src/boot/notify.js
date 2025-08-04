import { Notify } from 'quasar'

export default () => {
  Notify.setDefaults({
    position: 'top',
    timeout: 2500,
    textColor: 'white',
  })
}
