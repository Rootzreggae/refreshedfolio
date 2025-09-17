import { visit } from 'unist-util-visit';

export function storyDirectives() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      const { name, attributes } = node;
      
      switch (name) {
        case 'carousel': {
          const { title } = attributes || {};
          const images = [];
          const captions = [];
          
          // Extract images from children
          visit(node, 'image', (imgNode) => {
            images.push(imgNode.url);
            if (imgNode.alt) captions.push(imgNode.alt);
          });
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompCarousel';
          node.attributes = [
            ...(title ? [{ type: 'mdxJsxAttribute', name: 'title', value: title }] : []),
            { 
              type: 'mdxJsxAttribute', 
              name: 'images', 
              value: { 
                type: 'mdxJsxAttributeValueExpression', 
                value: JSON.stringify(images), 
                data: { estree: { type: 'ArrayExpression', elements: images.map(url => ({ type: 'Literal', value: url })) } }
              }
            },
            { 
              type: 'mdxJsxAttribute', 
              name: 'captions', 
              value: { 
                type: 'mdxJsxAttributeValueExpression', 
                value: JSON.stringify(captions),
                data: { estree: { type: 'ArrayExpression', elements: captions.map(caption => ({ type: 'Literal', value: caption })) } }
              }
            }
          ];
          node.children = [];
          break;
        }
        
        case 'side-by-side': {
          const { reverse, image, 'image-alt': imageAlt, 'image-caption': imageCaption } = attributes || {};
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompSideBySide';
          node.attributes = [
            ...(reverse === 'true' ? [{ type: 'mdxJsxAttribute', name: 'reverse', value: { type: 'mdxJsxAttributeValueExpression', value: 'true' } }] : []),
            ...(image ? [{ type: 'mdxJsxAttribute', name: 'image', value: image }] : []),
            ...(imageAlt ? [{ type: 'mdxJsxAttribute', name: 'imageAlt', value: imageAlt }] : []),
            ...(imageCaption ? [{ type: 'mdxJsxAttribute', name: 'imageCaption', value: imageCaption }] : [])
          ];
          break;
        }
        
        case 'expandable': {
          const { title, 'default-open': defaultOpen } = attributes || {};
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompExpandable';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'title', value: title || 'Expandable Section' },
            ...(defaultOpen === 'true' ? [{ type: 'mdxJsxAttribute', name: 'defaultOpen', value: { type: 'mdxJsxAttributeValueExpression', value: 'true' } }] : [])
          ];
          break;
        }
        
        case 'before-after': {
          const { 
            'before-label': beforeLabel, 
            'after-label': afterLabel,
            'before-image': beforeImage,
            'after-image': afterImage,
            height 
          } = attributes || {};
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompBeforeAfter';
          node.attributes = [
            ...(beforeLabel ? [{ type: 'mdxJsxAttribute', name: 'beforeLabel', value: beforeLabel }] : []),
            ...(afterLabel ? [{ type: 'mdxJsxAttribute', name: 'afterLabel', value: afterLabel }] : []),
            ...(beforeImage ? [{ type: 'mdxJsxAttribute', name: 'beforeImage', value: beforeImage }] : []),
            ...(afterImage ? [{ type: 'mdxJsxAttribute', name: 'afterImage', value: afterImage }] : []),
            ...(height ? [{ type: 'mdxJsxAttribute', name: 'height', value: height }] : [])
          ];
          break;
        }
        
        case 'image-grid': {
          const { columns, gap } = attributes || {};
          const images = [];
          
          // Extract images from children
          visit(node, (child) => {
            if (child.type === 'image') {
              images.push({
                src: child.url,
                alt: child.alt,
                size: child.data?.size || 'normal'
              });
            }
          });
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompImageGrid';
          node.attributes = [
            { 
              type: 'mdxJsxAttribute', 
              name: 'images', 
              value: { 
                type: 'mdxJsxAttributeValueExpression', 
                value: JSON.stringify(images),
                data: { estree: { type: 'ArrayExpression', elements: [] } }
              }
            },
            ...(columns ? [{ type: 'mdxJsxAttribute', name: 'columns', value: { type: 'mdxJsxAttributeValueExpression', value: columns } }] : []),
            ...(gap ? [{ type: 'mdxJsxAttribute', name: 'gap', value: gap }] : [])
          ];
          node.children = [];
          break;
        }
        
        case 'parallax': {
          const { title, subtitle, 'background-image': backgroundImage, height } = attributes || {};
          
          node.type = 'mdxJsxFlowElement';
          node.name = 'CompParallax';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'title', value: title || 'Parallax Section' },
            ...(subtitle ? [{ type: 'mdxJsxAttribute', name: 'subtitle', value: subtitle }] : []),
            ...(backgroundImage ? [{ type: 'mdxJsxAttribute', name: 'backgroundImage', value: backgroundImage }] : []),
            ...(height ? [{ type: 'mdxJsxAttribute', name: 'height', value: height }] : [])
          ];
          break;
        }
      }
    });
  };
}