const addOrUpdateReaction = async (userId, commentId, type) => {
  try {
    const response = await fetch('http://localhost:5000/api/reactions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, commentId, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to add reaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

const removeReaction = async (userId, commentId) => {
  try {
    const response = await fetch('http://localhost:5000/api/reactions/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, commentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove reaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
};

const getReactionsForComments = async (commentIds) => {
  try {
    const response = await fetch('http://localhost:5000/api/reactions/get-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to get reactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting reactions:', error);
    throw error;
  }
};

export { addOrUpdateReaction, removeReaction, getReactionsForComments };
