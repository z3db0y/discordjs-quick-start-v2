export interface Config {
    token: string;
}

export interface Command {
    name: string;
    description: string;
    options?: import('discord.js').APIApplicationCommandOption[];
    metadata?: {
        guildOnly?: boolean;
        ownerOnly?: boolean;
        permissions?: import('discord.js').PermissionResolvable[];
    };
    execute: (interaction: import('discord.js').ChatInputCommandInteraction) => void;
}

export interface Button {
    name: string;
    metadata?: {
        authorOnly?: boolean;
    };
    execute: (interaction: import('discord.js').ButtonInteraction) => void;
}