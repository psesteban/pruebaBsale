import { Router } from 'express'
import { getFlightPassengers } from '../controllers/flightcontroller.js'

const router = Router()
router.route('/flights/:id/passengers').get((req, res) => {
  req.id = req.params.id
  getFlightPassengers(req.id, res)
})

export default router
