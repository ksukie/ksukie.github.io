# Extracted resume material

Source: the user-provided local file
`C:/Users/asus/Desktop/ksukie.github.io/resumesoft.html` (updated July 23,
2026). The workspace snapshot predates this update; project facts below are
extracted from the supplied current file.

The user explicitly stated that the page contains their own information.

## Identity and target

- Chinese display name: 柯书奇
- English display name: Shuqi Ke
- Direction: Computer Vision / Edge AI / Robot Learning
- Source page language: Chinese (`zh-CN`)
- Primary resume language: English, matching the user-mandated Tairan reference

## Contact

- Phone: 15707039996
- Email: 15707039996@163.com
- GitHub: https://github.com/ksukie
- The page says “Portfolio & Code Registry” but provides no URL; omit it.

## Education and credentials

- Jiujiang University, IoT Engineering, 2022.09 - 2026.06
- Core courses: Data Structures, Computer Networks, Operating Systems,
  Computer Organization, Advanced Programming
- Credentials: CET-4 / CET-6

## Internship

- User-confirmed display title: Algorithm Engineer Intern, Shenzhen Shita
  Robotics Technology Co., Ltd., 2026.02 - 2026.08. The supplied page originally
  labels the role as Image Algorithm Intern.
- Built a real-robot visual-tactile data collection, recording, training, and
  inference pipeline for embodied intelligence and edge-vision work.
- Integrated leader-follower arm control, tactile cameras, multimodal data
  management, ACT, PI0, and PI0.5 configuration and effective-batch statistics.
- Developed double-frame motion-vector prediction and multi-camera detection /
  template tracking; completed model and loss optimization, FP16 / INT8
  quantization, calibration data construction, and edge consistency validation.
- Worked across PC, RV1126B, and RK3588 with GStreamer / MIPI, concurrency,
  profiling, hardware integration, and on-site calibration.

## Research experience

- JJU CVI Lab, 2022.12 - 2025.09
- Areas: object detection, semantic segmentation, and edge AI.
- Covered problem formulation, experimental hypothesis design, ablation studies,
  error analysis, and research-result presentation.
- Built a biomedical-image workflow for chromosome segmentation and detection,
  including preprocessing, candidate-region detection, review, abnormal-sample
  annotation, batch loading, manual correction, and export through PyQt5.
- User confirmation: handled data annotation and processing; investigated ResNet
  and DenseNet backbones, SAM segmentation models, and wire-sequence detection
  models; and independently conducted the experimental work for a first-author
  paper.
- User confirmation: maintained the PyQt5 workflow's UI and related front-end/
  back-end functionality.

## Research outputs

### TY-YOLO

- Role/status: first author; JCR Q2; under review.
- English title: TY-YOLO: An attention-based multi-scale complex scene fire
  smoke detection algorithm.
- Work: model selection, architecture optimization, loss tuning, manuscript
  writing, attention mechanisms, and multiscale feature fusion for early
  wildfire smoke detection under small targets, occlusion, and complex backgrounds.

### FgFEU-Net

- Status: published; medical image segmentation.
- English title: FgFEU-Net: A Fine-Grained Feature Extraction U-Net Model for
  Breast Tumor Segmentation Based on Transfer Learning.
- Official paper page: https://link.springer.com/chapter/10.1007/978-3-032-06307-6_4
- Work: VGG16 encoder, same-level feature fusion, and Combo Loss for blurry
  tumor boundaries and foreground/background imbalance in breast ultrasound.

### Edge-cloud intelligent transportation detection

- Status: published; edge-cloud real-time detection.
- English title: The Real-Time Intelligent Transportation Detection System
  Based on Edge-Cloud Collaborative Computing.
- Official paper page: https://link.springer.com/chapter/10.1007/978-3-032-06307-6_7
- Work: YOLOv8n edge inference for vehicle recognition, flow statistics,
  congestion perception, wrong-way detection, and boundary-crossing alerts.

## Projects

### VTLA

- Built a LeRobot 0.5.2-compatible real-robot stack integrating AgileX Piper
  leader-follower control, LTeach tactile cameras, recording, training, inference,
  CAN bus, streaming encoding, episode management, and multimodal statistics.
- Extended PI0.5 with tactile input, `TactileEncoder`, tactile-token projection,
  and `embed_tactile_image`; adapted gradient accumulation and effective-batch
  statistics for training and deployment evaluation.

### IsaacSim-Tactile4OpenWorld

- Built an Isaac Sim / Isaac Lab robot-contact and visuotactile platform with
  UIPC / libuipc rigid-soft contact, flexible-membrane deformation,
  tactile-image synthesis, and 3D Fx / Fy / Fz force-field reconstruction.
- Covers GelSight Mini, Taxim, FOTS, and FEM tactile methods; AgileX Piper and
  Franka grasping, insertion, rolling, and contact experiments; V1--V6.2
  experiments, HDF5 collection, and dependency boundaries.

### OpenFireAlert

- Trained a YOLO11 fire-and-smoke detector; exported ONNX / TensorRT and
  deployed it on Jetson with RTSP streaming, edge inference, alerts, and web
  visualization.
- Integrated ESP32 sensor nodes and a Spring Boot control plane for
  environmental data, detection state, device commands, and alert records.

### TactileFlowField

- Built a dense displacement-field learning and deployment project for
  visuotactile sensors, including multiple model versions, 27 training
  experiments, PyTorch datasets, and video-stream inference.
- Exported ONNX and FP16 / PTQ INT8 RKNN models; deployed with RKNNLite on
  RV1126B and supported multi-stream video, baseline calibration, and
  single- / multi-device tactile-camera APIs.

### EdgeVisTrack-RKNN

- Built an RV1126B multi-camera circular-marker tracker using first-frame ROI
  thresholds, Hough circles, local template correlation, displacement and hue
  change tracking, loss recovery, and a CPU reference backend.
- Designed Fixed / Dynamic RKNN batch backends using Cython ROI cropping, FP16
  LUTs, reusable buffers, and the RKNN C API for high-frequency work across
  five cameras with staged performance observation.

### Vision Workbench

- Built a PySide6 desktop computer-vision workbench covering traditional image
  processing, panorama reconstruction, camera diagnostics, classification,
  YOLO26 detection / instance segmentation, semantic segmentation, and training.
- Added modular Python APIs, model/dataset management, automated tests,
  packaging metadata, bilingual docs, and separated base versus optional
  deep-learning dependencies.

### AdaptiveUI-SKILL

- Built explicitly invoked, framework-agnostic AdaptiveUI-S / AdaptiveUI-N
  skills for responsive layout, overflow, interaction, accessibility, and
  cross-browser fallbacks, with a dependency-free auditor and CI thresholds.

### AgentTools

- Built explicit Agent / Codex diagnostics, cross-platform AGENTS.md templates,
  task-context continuation, and skill inventories for PowerShell profiles,
  Conda hooks, Python encoding, Git line endings, proxies / TUN, and reconnect
  signals; behavior is read-only and does not access secrets.

## Technical stack

- Vision/modeling: PyTorch, YOLO11, U-Net, OpenCV, Cython
- Deployment: ONNX, TensorRT, RKNN, RKNNLite, FP16, PTQ INT8
- Hardware: Jetson, RV1126B, RK3588, ESP32
- Robot learning: LeRobot, ACT, PI0, PI0.5, Piper, Isaac Sim, Isaac Lab, UIPC,
  tactile sensing, data collection
- Video/edge: GStreamer, RTSP, MIPI
- Engineering: Python, PyQt5, PySide6, Spring Boot 3, HDF5, benchmarking,
  logging, profiling
