const fs = require('fs');
const path = require('path');

const files = [
    'd:\\Transfer\\Campus_Portal\\client\\src\\pages\\PlacementRecords.jsx',
    'd:\\Transfer\\Campus_Portal\\client\\src\\pages\\StudentDatabase.jsx',
    'd:\\Transfer\\Campus_Portal\\client\\src\\pages\\ManageNotices.jsx',
    'd:\\Transfer\\Campus_Portal\\client\\src\\pages\\ManageQueries.jsx'
];

files.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Apply color theme replacements
        content = content.replace(/#0B2447/g, '#11241a');
        content = content.replace(/#0F172A/g, '#11241a');
        content = content.replace(/#113264/g, '#1a1728');
        content = content.replace(/bg-blue-600/g, 'bg-[#11241a]');
        content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#1a1728]');
        content = content.replace(/text-blue-600/g, 'text-[#D4AF37]');
        content = content.replace(/bg-blue-50/g, 'bg-[#D4AF37]/5');
        content = content.replace(/text-blue-800/g, 'text-[#11241a]');
        content = content.replace(/border-blue-200/g, 'border-[#D4AF37]/20');
        content = content.replace(/border-blue-500/g, 'border-[#D4AF37]');
        content = content.replace(/ring-blue-500/g, 'ring-[#D4AF37]');
        content = content.replace(/bg-indigo-50/g, 'bg-[#11241a]/5');
        content = content.replace(/text-indigo-600/g, 'text-[#11241a]');
        content = content.replace(/text-indigo-700/g, 'text-[#11241a]');
        content = content.replace(/border-indigo-100/g, 'border-[#11241a]/10');
        content = content.replace(/bg-indigo-500/g, 'bg-[#11241a]');
        content = content.replace(/bg-indigo-600/g, 'bg-[#11241a]');
        content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-[#1a1728]');
        
        // Borders and typography tweaks
        content = content.replace(/border-gray-200/g, 'border-[#11241a]/10');
        content = content.replace(/text-2xl font-extrabold text-\[\#11241a\]/g, 'text-2xl font-serif font-medium text-[#11241a]');
        content = content.replace(/text-3xl font-extrabold text-\[\#11241a\]/g, 'text-3xl font-serif font-medium text-[#11241a]');
        content = content.replace(/text-lg font-extrabold text-\[\#11241a\]/g, 'text-lg font-serif font-medium text-[#11241a]');
        content = content.replace(/text-xl font-extrabold text-\[\#11241a\]/g, 'text-xl font-serif font-medium text-[#11241a]');

        // Notice page specific
        content = content.replace(/border-blue-100/g, 'border-[#D4AF37]/20');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e.message);
    }
});
