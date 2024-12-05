export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly lightColor: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
  
  export const colourOptions: readonly ColourOption[] = [
    { value: 'user', label: 'User', lightColor: 'lightgreen',color: 'green' },
    { value: 'admin', label: 'Admin', lightColor: '#8467D7',color: 'purple' },
    { value: 'superuser', label: 'Super User', lightColor: 'lightblue',color: 'blue' },
    { value: 'guest', label: 'Guest', lightColor: '#FFCCCB', color: 'red' },
    { value: 'moderator', label: 'Moderator', lightColor: '#FED8B1', color: 'orange' },

  ];
  
