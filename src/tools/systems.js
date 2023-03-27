/**
 * FUNCTION RELATED TO KAIOS SYSTEMS
 *
 * In this files, we store all function to use features from KaiOS system.
 */

export const openSettings = () => {
  if (typeof MozActivity === "function") {
    // eslint-disable-next-line
    let activity = new MozActivity({
      name: "configure",
      data: {
        target: "device",
        section: "appPermissions",
      },
    });
    activity.onsuccess = function () {
      //success
    };
    activity.onerror = function () {
      //error
    };
  }
};
