const API_URL = 'https://hk-fitters-backend.onrender.com/api/newsletter';

export const getSubscribers = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }

    return await response.json();
  } catch (error) {
    console.error('Get subscribers error:', error);
    return [];
  }
};

export const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
};

export const deleteSubscriber = async (subscriberId) => {
  try {
    const response = await fetch(
      `${API_URL}/${subscriberId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete subscriber');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete subscriber error:', error);
    throw error;
  }
};