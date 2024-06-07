import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'
import auth from '../Middleware/auth';

const CalendarRouter = express.Router()

CalendarRouter.post('/calendar/create', auth, CalendarController.createCalendar)
// CalendarRouter.post('/calendar/create/schedule', auth, CalendarController.createSchedule)
// CalendarRouter.post('/calendar/create/schedule/timeslot/:scheduleId', auth, CalendarController.createScheduling)

CalendarRouter.patch('/calendar/update/:calendarId', auth, CalendarController.updateThisCalendar)
CalendarRouter.patch('/calendar/update/after/:calendarId', auth, CalendarController.updateAfterCalendar)

CalendarRouter.delete('/calendar/delete/:calendarId', auth, CalendarController.deleteThisCalendar)
CalendarRouter.delete('/calendar/delete/after/:calendarId', auth, CalendarController.deleteAfterCalendar)
// CalendarRouter.delete('/calendar/delete/schedule/:scheduleId', auth, CalendarController.deleteScheduleEvent)

CalendarRouter.get('/calendar', auth, CalendarController.showCalendar)
CalendarRouter.get('/calendar/:calendarId', auth, CalendarController.showOneCalendar)
CalendarRouter.get('/calendar/get/month/:dateString', auth, CalendarController.showMonthCalendar)
CalendarRouter.get('/calendar/get/week', auth, CalendarController.getThisWeeksDuty)
// CalendarRouter.get('/calendar/schedule/schedule', auth, CalendarController.showSchedule)
// CalendarRouter.get('/calendar/schedule/timeslot/:scheduleId', auth, CalendarController.showScheduling)
CalendarRouter.get('/calendar/todo/mine', auth, CalendarController.showMyTodo)
CalendarRouter.get('/calendar/todo/not/mine', auth, CalendarController.showMatesTodo)

export { CalendarRouter }
