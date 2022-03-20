export class MenuItem {
    constructor(
        public name: string,
        public route: string,
        public toolTip: string,
        public icon: string = ''
    ) {}
}

export const menuList = [
    new MenuItem('Calendar', 'calendar', 'montly calendar', 'calendar_today'),
    new MenuItem('Profile', 'user-profile', 'user', 'person')
];