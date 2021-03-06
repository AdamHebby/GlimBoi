var recentChannelsDB;
var path = "./";

/**
 * Updates the path to the DB. The path variable is updated
 */
function updatePath(GUI) {
  console.log("User path is " + GUI);
  path = GUI;
  recentChannelsDB = new Datastore({ filename: `${path}/data/recentChannels.db`, autoload: true });
}

/**
 * Adds a recent channel to GlimBoi
 * @param {string} object The channel object
 * @returns If successful returns the user.
 */
async function addRecentChannel(channel, timestamp = null, autoJoin = false) {
  var timestamp = timestamp ?? (Date.now());

  var channelDoc = await new Promise(done => {
    recentChannelsDB.find({ channel: channel }, function (err, doc) {
      if (doc.length == 0) {
        console.log("No channel was found with the name " + channel);
        recentChannelsDB.insert({channel: channel, timestamp: timestamp}, function (err, doc) {
          console.log(doc);
          done(doc)
        });
      } else {
        recentChannelsDB.update({ channel: channel }, { $set: { timestamp: timestamp } }, {returnUpdatedDocs: true}, function (err, num, doc) {
          console.log(doc);
          done(doc)
        });
      }
    })
  })
  return channelDoc;
}

/**
 * Disables autoJoin for all channels, then enables for a specified channel
 *
 * @param {string} id
 * @param {bool} autoJoinEnabled
 */
async function setAutoJoinChannelByID(id, autoJoinEnabled) {
  return new Promise(done => {
    console.log(`Disabling autoJoin for all channels`);

    recentChannelsDB.update({ autoJoin: true }, { $set: { autoJoin: false } }, {returnUpdatedDocs: false}, function (err, num, doc) {
      if (autoJoinEnabled) {
        console.log(`Setting autojoin to ${autoJoinEnabled} for ${id}`);
        recentChannelsDB.update({ _id: id }, { $set: { autoJoin: autoJoinEnabled } }, {returnUpdatedDocs: true}, function (err, num, doc) {
          done(doc)
        });
      } else {
        done(null);
      }
    });
  });
}

/**
 * Removes a channel from recent chat DB, by the channel ID, the ID is what's in the DB
 *
 * @param {string} id Name of the id
 */
async function removeRecentChannelByID(id) {
  return new Promise(resolve => {
    recentChannelsDB.remove({ _id: id }, { multi: false }, function (err, doc) {
      resolve()
    });
  });
}


/**
 * Get all recent Channels
 * @returns Returns array of channel objects
 */
async function getAllRecentChannels() {
  return new Promise(resolve => {
    recentChannelsDB.find({}, function (err, docs) {
      console.log('Returning all recent channels.');
      resolve(docs)
    })
  })
}

module.exports = { updatePath, addRecentChannel, setAutoJoinChannelByID, getAllRecentChannels, removeRecentChannelByID };
