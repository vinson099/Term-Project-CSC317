const db = require ("./db.js")

const products = [
    {
      id: '1000qb',
      title: '1000-Qubit Quantum Processor',
      price: 2500000.00,
      description: 'Our flagship 1000-qubit processor delivers industry-leading scale for complex quantum algorithms. Engineered with superconducting qubits and integrated microwave control, it\'s ready for large-scale experimentation.',
      imageUrl: 'https://cdn.mos.cms.futurecdn.net/eRpdQmXhxFEXgqkFE4xB7-1600-80.jpg.webp',
      features: [
        '1000 superconducting transmon qubits',
        'Qubit coherence time: 120 µs',
        'Gate fidelity: 99.9%',
        '12,800 control lines',
        'Operating temperature: 10 mK'
      ]
    },
    {
      id: 'silicon',
      title: 'Silicon Quantum Processor Chip',
      price: 1200000.00,
      description: 'A next-generation silicon-based quantum chip optimized for spin-qubit coherence. Ideal for research into scalable spin-qubit architectures and CMOS integration.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6lbb5RtIVSHx9OZ3lrM0ifTKpER1n6HJPw&s',
      features: [
        '64 spin-qubits in silicon',
        'Coherence time: 200 µs',
        'On-chip cryo-CMOS control circuitry',
        'Wafer-scale fabrication compatibility',
        'Works at 100 mK'
      ]
    },
    {
      id: 'eagle',
      title: 'IBM Eagle 127-Qubit Chip',
      price: 1800000.00,
      description: 'IBM\'s Eagle processor features 127 superconducting qubits in a low-cross talk lattice. Designed for exploring advanced error-correction and multi-qubit entanglement.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmgjR-vmx4X1TXnEyhSmJ_TUpX44gklOgu7w&s',
      features: [
        '127 transmon qubits',
        'Qubit coherence: 100 µs',
        '2-qubit gate fidelity: 99.8%',
        '16-layer cryogenic packaging',
        'Operating temperature: 15 mK'
      ]
    },
    {
      id: 'willow70',
      title: 'Google Willow 70-Qubit Chip',
      price: 2000000.00,
      description: 'Google\'s Willow processor offers 70 qubits in a tunable coupler architecture. Perfect for exploring quantum supremacy benchmarks and advanced compilation techniques.',
      imageUrl: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1vAP8i.img?w=634&h=407&m=6',
      features: [
        '70 superconducting qubits',
        'Gate f-test tuned couplers',
        'Coherence time: 110 µs',
        'Scalable 3-D packaging',
        '10 mK dilution refrigerator compatible'
      ]
    },
    {
      id: '2qubit',
      title: '2-Qubit Silicon Logic Module',
      price: 450000.00,
      description: 'Compact 2-qubit module for prototyping quantum logic in silicon spin‐qubit platforms. Includes integrated control electronics and cryo-compatible connectors.',
      imageUrl: 'https://www.pbs.org/wgbh/nova/media/images/trap-hed.width-2500.jpg',
      features: [
        '2 spin-qubits in Si/SiGe',
        'Integrated cryo-control PCB',
        'Coherence: 150 µs',
        'Low-noise gate drivers',
        'Compatible with 20 mK systems'
      ]
    },
    {
      id: 'majorana1',
      title: 'Majorana 1 Topological Qubit',
      price: 3200000.00,
      description: 'Experimental topological qubit leveraging Majorana zero modes for intrinsic error resilience. Ideal for fault‐tolerant quantum computing research.',
      imageUrl: 'https://azure.microsoft.com/en-us/blog/quantum/wp-content/uploads/2025/02/majorana1_1260x708_v2.jpg',
      features: [
        '1 Majorana topological qubit',
        'Protected by non-Abelian statistics',
        'Coherence: 500 µs (target)',
        'Cryo-nanowire architecture',
        'Operates at 10 mK'
      ]
    },
    {
      id: 'bristlecone',
      title: 'Google Bristlecone 72-Qubit Processor',
      price: 1600000.00,
      description: 'The Bristlecone processor from Google features 72 superconducting qubits for benchmarking quantum advantage. Excellent for gate‐error characterization and algorithm validation.',
      imageUrl: 'https://assets.newatlas.com/dims4/default/3d65f97/2147483647/strip/true/crop/782x521+72+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fgoogle-bristlecone-3.png',
      features: [
        '72 transmon qubits',
        'Gate fidelity: 99.7%',
        'Coherence: 95 µs',
        'Multi-layer cryo-PCB',
        'Ready for 15 mK operation'
      ]
    },
    {
      id: '19q',
      title: 'Rigetti 19Q Superconducting Processor',
      price: 850000.00,
      description: 'Rigetti\'s 19-qubit chip is built on a planar superconducting platform with fast qubit readout. Perfect for small-scale algorithm testing and hardware integration.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mEywTyIBapC0mYeR9wHeYkk9358GarCMGA&s',
      features: [
        '19 superconducting qubits',
        'Fast dispersive readout',
        'Coherence: 80 µs',
        'Integrated dilution refrigerator mount',
        'Control via RF-multiplexed lines'
      ]
    },
    {
      id: 'nextgen',
      title: 'Next-Gen Quantum CPU Module',
      price: 950000.00,
      description: 'A modular quantum CPU designed for edge-computing integration. Features hybrid classical-quantum interfacing and low-latency control electronics.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu_7a87HGwTKDWDsOdDlgenDJo-M4WbRHJPg&s',
      features: [
        '32 qubits (configurable)',
        'Hybrid classical interface',
        'Latency: < 50 ns',
        'Embedded FPGA control',
        'Operates at 15 mK'
      ]
    }
  ];

const insert = `INSERT INTO products(title, price, description, image_url, features) VALUES (?, ?, ?, ?, ?)`;

products.forEach(product => {
    const { title, price, description, imageUrl, features } = product;
    db.run(insert, [title, price, description, imageUrl, JSON.stringify(features)], function(err) {
        if(err) {
            console.error("Failed to insert:", err.message);
        } else {
            console.log(`Successfully loaded ${title}`);
        }
    });
});
