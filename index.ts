import './deps/color';
import { Config, Command, Button } from './index.d';
import * as Discord from 'discord.js';
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});
const config: Config = require('./config.json');
let appInfo: Discord.ClientApplication | null;

client.on('ready', async () => {
    if(!client.user) return;
    console.log('Logged in as', client.user.tag.green);
    await client.application?.fetch();
    appInfo = client.application;
    await client.rest.put(Discord.Routes.applicationCommands(client.user.id), {
        body: Array.from(commands.values()).map(command => {
            return {
                name: command.name,
                description: command.description,
                options: command.options,
                type: 1
            }
        })
    });
});

client.login(config.token);

let commands = new Map<string, Command>();
let buttons = new Map<string, Button>();

client.on('interactionCreate', async interaction => {
    if(interaction.isChatInputCommand()) {
        let command = commands.get(interaction.commandName);
        if(!command) return;
        if(command.metadata) {
            if(command.metadata.guildOnly && !interaction.guild) {
                interaction.reply({
                    content: 'This command can only be used in a guild.'
                });
                return;
            }

            if(command.metadata.ownerOnly && interaction.user.id !== appInfo?.owner?.id) {
                interaction.reply({
                    content: 'This command can only be used by the bot owner.'
                });
                return;
            }

            if(command.metadata.permissions) {
                if(!interaction.member) return;
                let missingPermissions = command.metadata.permissions.filter(permission => !(interaction.member?.permissions as Discord.PermissionsBitField).has(permission));
                if(missingPermissions.length > 0) {
                    interaction.reply({
                        content: 'You do not have permission to use this command.'
                    });
                    return;
                }
            }
        }

        try {
            command.execute(interaction);
        } catch(e) {
            console.error(`Failed to execute command`, command.name.red);
            console.error(e);
            interaction.reply({
                content: 'An error occurred while executing this command.'
            });
        }
    } else if(interaction.isButton()) {
        let buttonInfo: any; 
        try { buttonInfo = JSON.parse(interaction.customId); } catch {}

        let button = buttons.get(buttonInfo ? buttonInfo.action : interaction.customId);
        if(!button) return;
        if(button.metadata) {
            if(button.metadata.authorOnly && (interaction.user.id !== interaction.message.author.id || !interaction.message)) {
                interaction.reply({
                    content: 'You cannot use this button.'
                });
            }
        }

        try {
            if(buttonInfo) button.execute(interaction, buttonInfo.metadata);
            else button.execute(interaction);
        } catch(e) {
            console.error(`Failed to execute button`, button.name.red);
            console.error(e);
            interaction.reply({
                content: 'An error occurred while executing this button.'
            });
        }
    }
});

let commandFiles = require('fs').readdirSync('./commands').filter((file: String) => file.endsWith('.ts'));
for(let i = 0; i < commandFiles.length; i++) {
    try {
        let command: Command = require(`./commands/${commandFiles[i]}`).default;
        commands.set(command.name, command);
        console.log(`Loaded command`, commandFiles[i].green, command);
    } catch(e) {
        console.error(`Failed to load command`, commandFiles[i].red);
        console.error(e);
    }
}

let buttonFiles = require('fs').readdirSync('./buttons').filter((file: String) => file.endsWith('.ts'));
for(let i = 0; i < buttonFiles.length; i++) {
    try {
        let button: Button = require(`./buttons/${buttonFiles[i]}`).default;
        buttons.set(button.name, button);
        console.log(`Loaded button`, buttonFiles[i].green, button);
    } catch(e) {
        console.error(`Failed to load button`, buttonFiles[i].red);
        console.error(e);
    }
}