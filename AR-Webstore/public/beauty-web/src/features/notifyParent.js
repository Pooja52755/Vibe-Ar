// Function to add at the end of features/index.js
function notifyParentOfSelectedFeatures() {
  // Get parent component (BnbApp)
  const app = this.$parent;
  
  // Only proceed if the parent has the updateSelectedFeatures method
  if (app && typeof app.updateSelectedFeatures === 'function') {
    // Send current features to parent
    this.features.forEach(feature => {
      app.updateSelectedFeatures(feature, true);
    });
  }
}

export { notifyParentOfSelectedFeatures };