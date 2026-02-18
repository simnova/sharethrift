import { Actor, Cast, TakeNotes, Notepad, notes } from '@serenity-js/core';

const actor = new Actor('Test', new Cast().prepare(new Actor('Test').whoCan(TakeNotes.using(Notepad.empty()))));

// Check what notes() returns
console.log('notes():', notes());
console.log('notes() type:', typeof notes());

// Check TakeNotes ability
const notepad = TakeNotes.as(actor);
console.log('notepad:', notepad);
console.log('notepad methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(notepad)));
