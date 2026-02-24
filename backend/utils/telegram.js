const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = null;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    }
  }

  formatJobMessage(job) {
    const emojis = {
      title: '💼',
      company: '🏢',
      location: '📍',
      salary: '💰',
      type: '⏰',
      tags: '🏷️'
    };

    let message = `${emojis.title} *${this.escapeMarkdown(job.title)}*\n\n`;
    message += `${emojis.company} *Company:* ${this.escapeMarkdown(job.company)}\n`;
    message += `${emojis.location} *Location:* ${this.escapeMarkdown(job.location)}\n`;
    message += `${emojis.salary} *Salary:* ${this.escapeMarkdown(job.salary)}\n`;
    message += `${emojis.type} *Type:* ${this.escapeMarkdown(job.jobType)}\n`;

    if (job.tags && job.tags.length > 0) {
      // Properly escape hashtags for MarkdownV2
      const formattedTags = job.tags
        .filter(tag => tag && tag.trim())
        .map(tag => {
          const cleanTag = tag.replace(/\s+/g, '_').replace(/[^\w_]/g, '');
          return `\\#${cleanTag}`;
        })
        .join(' ');
      
      if (formattedTags) {
        message += `${emojis.tags} *Tags:* ${formattedTags}\n`;
      }
    }

    if (job.description) {
      const shortDesc = job.description.substring(0, 200);
      message += `\n${this.escapeMarkdown(shortDesc)}${job.description.length > 200 ? '...' : ''}\n`;
    }

    message += `\n🔗 *Source:* ${this.escapeMarkdown(job.source)}`;

    return message;
  }

  escapeMarkdown(text) {
    if (!text) return '';
    return text
      .toString()
      .replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
  }

  async postJob(job) {
    if (!this.bot || !this.chatId) {
      console.log('Telegram bot not configured, skipping post');
      return null;
    }

    try {
      const message = this.formatJobMessage(job);
      
      const keyboard = {
        inline_keyboard: [[
          {
            text: '🚀 APPLY HERE!',
            url: job.applyUrl
          }
        ]]
      };

      const result = await this.bot.sendMessage(this.chatId, message, {
        parse_mode: 'MarkdownV2',
        reply_markup: keyboard,
        disable_web_page_preview: true
      });

      return result.message_id;
    } catch (error) {
      console.error('Error posting to Telegram:', error.message);
      throw error;
    }
  }

  async testConnection() {
    if (!this.bot) {
      throw new Error('Telegram bot not configured');
    }

    try {
      const me = await this.bot.getMe();
      return { success: true, botName: me.username };
    } catch (error) {
      throw new Error(`Telegram connection failed: ${error.message}`);
    }
  }
}

module.exports = new TelegramService();
