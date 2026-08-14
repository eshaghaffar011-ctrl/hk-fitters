const API_URL = 'http://hk-fitters-backend.onrender.com/api/inquiries';

export const getInquiries = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }

    return await response.json();
  } catch (error) {
    console.error('Get inquiries error:', error);
    return [];
  }
};

export const createInquiry = async (inquiry) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiry),
    });

    if (!response.ok) {
      throw new Error('Failed to create inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Create inquiry error:', error);
    throw error;
  }
};

export const updateInquiryStatus = async (
  inquiryId,
  status
) => {
  try {
    const response = await fetch(
      `${API_URL}/${inquiryId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update inquiry status');
    }

    return await response.json();
  } catch (error) {
    console.error('Update inquiry status error:', error);
    throw error;
  }
};

export const deleteInquiry = async (inquiryId) => {
  try {
    const response = await fetch(
      `${API_URL}/${inquiryId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete inquiry error:', error);
    throw error;
  }
};