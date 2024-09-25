export const renderCategoryParent = (categories, id) => {
    const categoryParentName = categories.find((category) => category._id === id);
    return categoryParentName ? categoryParentName.name : 'Không';
}
