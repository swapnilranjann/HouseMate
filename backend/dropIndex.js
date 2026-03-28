const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropOldIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Explicitly drop the old unique email index
    await mongoose.connection.db.collection('users').dropIndex('email_1');
    console.log('Successfully dropped old unique index [email_1]');
    
    process.exit(0);
  } catch (err) {
    console.error('Error dropping index (it might not exist or we already dropped it):', err.message);
    process.exit(1);
  }
};

dropOldIndex();
