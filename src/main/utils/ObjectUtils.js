const ArrayUtils = require('./ArrayUtils');

module.exports = class ObjectUtils {
  static async everyPropRecursive({
    verifier = ({
      // eslint-disable-next-line no-unused-vars
      value, prop, parentProp, parent, parent2
    }) => true,
    resolver = ({
      // eslint-disable-next-line no-unused-vars
      value, prop, parentProp, parent, parent2
    }) => value,
    root = undefined,
    prop = undefined,
    parentProp = undefined,
    parent = undefined,
    parent2 = undefined
  }) {
    root = await resolver({
      value: root, prop, parentProp, parent, parent2
    });
    const nodePassed = await verifier?.({
      value: root, prop, parentProp, parent, parent2
    });
    if (!nodePassed) {
      return nodePassed;
    }
    if (Array.isArray(root)) {
      return ArrayUtils.every(
        [...root],
        (item) => this.everyPropRecursive({
          root: item,
          verifier,
          resolver,
          prop: root.indexOf(item),
          parentProp: prop,
          parent: root,
          parent2: parent
        })
      );
    }
    if (typeof root === 'object' && root) {
      return ArrayUtils.every(
        Object.entries(root),
        ([key, value]) => this.everyPropRecursive({
          root: value,
          verifier,
          resolver,
          prop: key,
          parentProp: prop,
          parent: root,
          parent2: parent
        })
      );
    }
    return nodePassed;
  }
};
