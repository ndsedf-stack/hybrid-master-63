// ============================================
// BODY TRACKER - Mesures corporelles & photos
// ============================================

class BodyTracker {
    constructor() {
        this.measurements = this.loadMeasurements();
        this.photos = this.loadPhotos();
    }
    
    loadMeasurements() {
        try {
            const data = localStorage.getItem('bodyMeasurements');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    loadPhotos() {
        try {
            const data = localStorage.getItem('progressPhotos');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    addMeasurement(data) {
        const measurement = {
            id: Date.now(),
            date: new Date().toISOString(),
            weight: data.weight,
            bodyFat: data.bodyFat,
            waist: data.waist,
            chest: data.chest,
            arms: data.arms,
            thighs: data.thighs,
            ...data
        };
        
        this.measurements.push(measurement);
        this.saveMeasurements();
        
        return measurement;
    }
    
    addPhoto(dataUrl, notes = '') {
        const photo = {
            id: Date.now(),
            date: new Date().toISOString(),
            dataUrl: dataUrl,
            notes: notes
        };
        
        this.photos.push(photo);
        this.savePhotos();
        
        return photo;
    }
    
    getLatestMeasurement() {
        return this.measurements[this.measurements.length - 1] || null;
    }
    
    getMeasurementTrend(metric, weeks = 12) {
        const recent = this.measurements.slice(-weeks);
        return recent.map(m => ({
            date: m.date,
            value: m[metric]
        }));
    }
    
    saveMeasurements() {
        localStorage.setItem('bodyMeasurements', JSON.stringify(this.measurements));
    }
    
    savePhotos() {
        localStorage.setItem('progressPhotos', JSON.stringify(this.photos));
    }
}

window.BodyTracker = BodyTracker;
