export const sendTelegramMessage = async (message: string) => {
  // Telegram bot token va chat ID ni environment variable'dan oladi
  const botToken = (import.meta as any).env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = (import.meta as any).env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token yoki chat ID topilmadi. Iltimos, VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID ni sozlang.");
    // Foydalanuvchiga xatolik qaytarmaymiz (agar demo holatda bo'lsa), faqat konsolga yozamiz
    return { success: false, error: 'Credentials not configured' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error("Telegram API xatosi");
    }

    return { success: true };
  } catch (error) {
    console.error("Telegram'ga jo'natishda xatolik yuz berdi:", error);
    return { success: false, error };
  }
};
