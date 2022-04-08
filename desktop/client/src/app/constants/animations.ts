import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeInAnimation =
    trigger('fadeInAnimation', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.7s', style({ opacity: 1 }))
        ]),
    ]);

  
export const slideInOutAnimation =
    trigger('slideInOutAnimation', [
        state('*', style({
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        })),

        transition(':enter', [
            style({
                right: '-100%',
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            animate('.5s ease-in-out', style({
                right: 0,
            }))
        ]),

        transition(':leave', [
            animate('.5s ease-in-out', style({
                right: '-100%',
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);